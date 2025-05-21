import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from "@mui/material";

const VehicleTable = ({ data }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Model</TableCell>
          <TableCell>License Plate</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Year</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((v) => (
          <TableRow key={`${v.vehicle_id}-${v.id}`}>
            <TableCell>{v.vehicle_id}</TableCell>
            <TableCell>{v.name}</TableCell>
            <TableCell>{v.type}</TableCell>
            <TableCell>{v.model}</TableCell>
            <TableCell>{v.license_plate}</TableCell>
            <TableCell>{v.status}</TableCell>
            <TableCell>{v.year}</TableCell>
            <TableCell>{v.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default VehicleTable;
