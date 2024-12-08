import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Skeleton } from '@mui/material';

const TableSkeleton: React.FC = () => {
  const rows = Array.from(new Array(5));

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, mt: 0 }}>
      <Table>
        <TableHead sx={{ height: 56 }}>
          <TableRow>
            <TableCell>
              <Skeleton variant="text" width="30%" />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="30%" />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="30%" />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="30%" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((_, index) => (
            <TableRow key={index} sx={{ height: 88 }}>
              <TableCell>
                <Skeleton variant="text" width="50%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="70%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="40%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="20%" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
