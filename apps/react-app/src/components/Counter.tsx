import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

export type CounterProps = {
  initialCount?: number;
};

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
        Count is {count}
      </Button>
      <Typography variant="body2" color="text.secondary">
        MUI + React state
      </Typography>
    </Stack>
  );
}
