import { useQuery } from "@tanstack/react-query";
import { Alert, Container, Stack, Typography } from "@mui/material";
import { Counter } from "./components/Counter";
import { TabularImport } from "./components/TabularImport";

type HealthResponse = {
  status: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
  return res.json();
}

function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
  });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h4">React + MUI + TanStack Query</Typography>
        <Counter />
        <TabularImport />
        {isLoading && <Alert severity="info">Checking backend health…</Alert>}
        {error && (
          <Alert severity="warning">
            Backend not reachable at {API_BASE_URL} ({(error as Error).message})
          </Alert>
        )}
        {data && <Alert severity="success">Backend status: {data.status}</Alert>}
      </Stack>
    </Container>
  );
}

export default App;
