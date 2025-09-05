"use client";
import * as React from "react";
import {
  Box, TextField, Button, Snackbar, Alert, CircularProgress,
  FormControlLabel, Checkbox, Stack, Typography,
} from "@mui/material";
import { userApi, UserDTO } from "../components/api/UserApi";

// Khai báo kiểu User để trả về cha (không dùng any)
type UserCreated = { id: number; name: string; email: string; active: boolean };
type Props = { onAdded?: (created: UserCreated) => void };

const UserForm: React.FC<Props> = ({ onAdded }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [active, setActive] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{
    open: boolean; msg: string; type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });

  const validateEmail = (v: string) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    setEmailError(ok || v.trim() === "" ? null : "Email không hợp lệ");
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // chặn double-submit

    const nameOk = name.trim().length > 0;
    const emailOk = validateEmail(email);

    if (!nameOk || !emailOk) {
      if (!nameOk) setToast({ open: true, msg: "Tên không được để trống", type: "error" });
      if (!emailOk && email.trim() !== "") setToast({ open: true, msg: "Email không hợp lệ", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload: UserDTO = { name: name.trim(), email: email.trim(), active };
      const created = await userApi.create(payload); // phải trả về {id, name, email, active}

      // Reset form
      setName(""); setEmail(""); setActive(true);
      setToast({ open: true, msg: "Thêm người dùng thành công!", type: "success" });

      // Trả user mới cho cha để prepend ngay
      onAdded?.(created as UserCreated);
    } catch (err: any) {
      setToast({ open: true, msg: err?.message || "Thêm thất bại!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          placeholder="Tên người dùng"
          variant="outlined"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          fullWidth
          placeholder="Email"
          variant="outlined"
          size="small"
          type="email"
          inputProps={{ autoComplete: "email", "aria-label": "Email" }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) validateEmail(e.target.value);
          }}
          onBlur={(e) => validateEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError ?? " "}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              disabled={loading}
              inputProps={{ "aria-label": "Trạng thái hoạt động" }}
            />
          }
          label="Hoạt động"
        />

        <Button type="submit" variant="contained" fullWidth sx={{ height: 44, mt: 2 }} disabled={loading}>
          {loading ? (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <CircularProgress size={20} color="inherit" />
              <Typography variant="body2">Đang thêm...</Typography>
            </Stack>
          ) : ("THÊM NGƯỜI DÙNG")}
        </Button>
      </form>

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
    </Box>
  );
};

export default UserForm;
