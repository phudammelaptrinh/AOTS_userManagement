"use client";
import * as React from "react";
import { useRouter } from "next/router";
import {
  Box,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { userApi, UserDTO } from "../../components/api/UserApi";

export default function UserEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = React.useState<UserDTO | null>(null);

  React.useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      const all = await userApi.getAll();
      const u = all.find((x: UserDTO) => x.id === Number(id));
      if (u) setUser(u);
    };
    fetchUser();
  }, [id]);

  const handleSave = async () => {
    if (!user || !user.id) return;
    await userApi.update(user.id, user);
    router.push("/"); // quay lại home
  };

  if (!user) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Đang tải...</div>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 420 }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Chỉnh sửa người dùng
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Tên"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            fullWidth
            sx={{ "& fieldset": { borderRadius: 2 } }}
          />
          <TextField
            label="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            fullWidth
            sx={{ "& fieldset": { borderRadius: 2 } }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={user.active}
                onChange={(e) =>
                  setUser({ ...user, active: e.target.checked })
                }
              />
            }
            label="Hoạt động"
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => router.push("/")}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Đồng ý
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
