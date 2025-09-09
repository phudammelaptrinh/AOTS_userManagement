'use client';
import React from 'react';

export default function Seed10k() {
  const [done, setDone] = React.useState(0);
  const total = 10000000;

  async function seed() {
    setDone(0);
    const users = Array.from({ length: total }, (_, k) => {
      const i = k + 1;
      return { name: `User ${i}`, email: `user${i}@example.com`, active: i % 2 === 0 };
    });

    const size = 500;
    for (let i = 0; i < users.length; i += size) {
      const chunk = users.slice(i, i + size);
      await fetch('http://localhost:8080/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk),
      });
      setDone(i + chunk.length);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <button onClick={seed}>Tạo 10m users</button>
      <div>Đã gửi: {done}/{total}</div>
    </div>
  );
}
