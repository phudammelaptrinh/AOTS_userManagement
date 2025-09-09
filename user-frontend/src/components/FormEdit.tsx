import * as React from "react";
import { Box, TextField, Button, Stack, FormControlLabel, Checkbox } from "@mui/material";
import { User } from "./UserList";

interface FormEditProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const FormEdit: React.FC<FormEditProps> = ({ user, onSave, onCancel }) => {
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [active, setActive] = React.useState(user.active);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <h3>Chỉnh sửa người dùng</h3>
      <Stack spacing={2}>
        <TextField label="Tên" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormControlLabel
          control={<Checkbox checked={active} onChange={(e) => setActive(e.target.checked)} />}
          label="Hoạt động"
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => onSave({ ...user, name, email, active })}
          >
            Đồng ý
          </Button>
        </Stack>
      </Stack>
    </Box>  
  );
};

export default FormEdit;
