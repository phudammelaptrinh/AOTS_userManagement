"use client";
import * as React from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, IconButton, Paper, Typography,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface UserListProps {
  users: User[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const UserListComp: React.FC<UserListProps> = ({ users, onDelete, onToggle }) => {
  const router = useRouter();

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.100" }} width="30%">Tên</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.100" }} width="30%">Email</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.100" }} width="20%" align="center">Hoạt động</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.100" }} width="20%" align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length > 0 ? users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell
                  sx={{ cursor: "pointer", color: "primary.main" }}
                  onClick={() => router.push(`/useredit/${u.id}`)}
                >
                  {u.name}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    aria-label={`Chuyển trạng thái ${u.name}`}
                    checked={u.active}
                    onChange={(e) => {
                      e.stopPropagation(); // phòng trường hợp click lan
                      onToggle(u.id);
                    }}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Xoá">
                    <IconButton
                      aria-label={`Xoá ${u.name}`}
                      color="error"
                      onClick={(e) => { e.stopPropagation(); onDelete(u.id); }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Chưa có người dùng</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// tránh re-render khi props không đổi
export default React.memo(UserListComp);
