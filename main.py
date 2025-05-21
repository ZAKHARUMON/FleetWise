from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import models
import schemas
import auth
from database import engine, get_db
from typing import List
from pydantic import BaseModel
import joblib
import numpy as np

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fleet Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Vehicle endpoints
@app.post("/vehicles/", response_model=schemas.Vehicle)
def create_vehicle(
    vehicle: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_vehicle = models.Vehicle(**vehicle.dict(), owner_id=current_user.id)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@app.get("/vehicles/", response_model=List[schemas.Vehicle])
def read_vehicles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    vehicles = db.query(models.Vehicle).filter(
        models.Vehicle.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return vehicles

# Telemetry data endpoints
@app.post("/api/data", response_model=schemas.TelemetryData)
async def receive_data(
    data: schemas.TelemetryDataCreate,
    db: Session = Depends(get_db)
):
    vehicle = db.query(models.Vehicle).filter(
        models.Vehicle.vehicle_id == data.vehicle_id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db_telemetry = models.TelemetryData(
        vehicle_id=vehicle.id,
        **data.dict(exclude={'vehicle_id'})
    )
    db.add(db_telemetry)
    db.commit()
    db.refresh(db_telemetry)
    return db_telemetry

@app.get("/vehicles/{vehicle_id}/telemetry", response_model=List[schemas.TelemetryData])
def get_vehicle_telemetry(
    vehicle_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    vehicle = db.query(models.Vehicle).filter(
        models.Vehicle.vehicle_id == vehicle_id,
        models.Vehicle.owner_id == current_user.id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    telemetry_data = db.query(models.TelemetryData).filter(
        models.TelemetryData.vehicle_id == vehicle.id
    ).offset(skip).limit(limit).all()
    return telemetry_data

# Load the model
try:
    model = joblib.load("maintenance_predictor_model.pkl")
except:
    # If model doesn't exist, create a simple one for testing
    from sklearn.ensemble import RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    # Train on some dummy data
    X = np.random.rand(100, 4)
    y = np.random.randint(0, 2, 100)
    model.fit(X, y)
    joblib.dump(model, "maintenance_predictor_model.pkl")

class VehicleData(BaseModel):
    mileage: float = 0
    engine_temp: float = 0
    fuel_eff: float = 0
    error_codes: int = 0

@app.post("/predict-maintenance")
async def predict_maintenance(vehicle_data: VehicleData):
    try:
        # Prepare features
        features = np.array([[
            vehicle_data.mileage,
            vehicle_data.engine_temp,
            vehicle_data.fuel_eff,
            vehicle_data.error_codes
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        return {
            "needsMaintenance": bool(prediction),
            "confidence": float(max(probability) * 100),
            "details": {
                "mileage": float(vehicle_data.mileage),
                "engineTemp": float(vehicle_data.engine_temp),
                "fuelEfficiency": float(vehicle_data.fuel_eff),
                "errorCodes": int(vehicle_data.error_codes)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 