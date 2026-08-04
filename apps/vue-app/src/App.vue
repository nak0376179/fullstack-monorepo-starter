<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import Counter from "./components/Counter.vue";
import TabularImport from "./components/TabularImport.vue";

type HealthResponse = {
  status: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
  return res.json();
}

const { data, error, isLoading } = useQuery({
  queryKey: ["health"],
  queryFn: fetchHealth,
  retry: false,
});
</script>

<template>
  <v-container class="py-8" style="max-width: 900px">
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Vue + Vuetify + TanStack Query</h1>
        <Counter class="mb-4" />
        <TabularImport class="mb-4" />
        <v-alert v-if="isLoading" type="info" class="mb-2"> Checking backend health… </v-alert>
        <v-alert v-if="error" type="warning" class="mb-2">
          Backend not reachable at {{ API_BASE_URL }} ({{ (error as Error).message }})
        </v-alert>
        <v-alert v-if="data" type="success"> Backend status: {{ data.status }} </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
