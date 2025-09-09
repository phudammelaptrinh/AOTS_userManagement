'use client';
import React, { useState } from 'react';
import { LinearProgress, Box, Button, Typography, Alert } from '@mui/material';

export default function LoadProgress() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startLoading = async () => {
    setLoading(true);
    setMessage(null);
    setProgress(0);

    const steps = [25, 50, 75, 100];
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 800)); 
      setProgress(steps[i]);
    }

    setMessage('Tải dữ liệu thành công!');
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Loading Data
      </Typography>

      <Box sx={{ my: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography sx={{ mt: 1 }}>{progress}%</Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={startLoading}
        disabled={loading}
      >
        {loading ? 'Đang tải...' : 'Bắt đầu Load'}
      </Button>

      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}
