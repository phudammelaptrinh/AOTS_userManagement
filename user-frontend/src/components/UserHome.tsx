"use client";

import * as React from "react";
import UserForm from "../components/UserForm";
import UserList, { User } from "../components/UserList";
import { userApi } from "../components/api/UserApi";
import { Box, Pagination, Stack, Snackbar, Alert, CircularProgress } from "@mui/material";

export default function UserHome() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [page, setPage] = React.useState(1);
  const size = 5;
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });

  const fetchPage = React.useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await userApi.getPage(p, size);
        setUsers(res.items as User[]);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        setToast({ open: true, msg: "Lỗi khi tải dữ liệu người dùng!", type: "error" });
      } finally {
        setLoading(false);
      }
    },
    [size]
  );

  React.useEffect(() => {
    fetchPage(page);
  }, [fetchPage, page]);

  // ✅ nhận user mới từ Form
  const handleAdded = React.useCallback(
    (created: User) => {
      setToast({ open: true, msg: "Thêm người dùng thành công!", type: "success" });

      if (page === 1 && users.length < size) {
        setUsers((prev) => [created, ...prev].slice(0, size));
      } else {
        setPage(1); // useEffect sẽ tự fetch
      }
    },
    [page, users, size]
  );

  const toggleUser = React.useCallback(
    async (id: number) => {
      const u = users.find((x) => x.id === id);
      if (!u) return;
      try {
        await userApi.update(id, { ...u, active: !u.active });
        await fetchPage(page);
      } catch (err) {
        setToast({ open: true, msg: "Không thể cập nhật trạng thái người dùng!", type: "error" });
      }
    },
    [users, page, fetchPage]
  );

  const deleteUser = React.useCallback(
    async (id: number) => {
      try {
        await userApi.delete(id);
        if (users.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          await fetchPage(page);
        }
        setToast({ open: true, msg: "Đã xóa người dùng.", type: "success" });
      } catch (err) {
        setToast({ open: true, msg: "Xóa người dùng thất bại!", type: "error" });
      }
    },
    [users.length, page, fetchPage]
  );

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>Quản lý người dùng</h1>

      {/* Form tạo mới */}
      <UserForm onAdded={handleAdded} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <UserList users={users} onDelete={deleteUser} onToggle={toggleUser} />
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
            disabled={loading}
          />
        </Stack>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
