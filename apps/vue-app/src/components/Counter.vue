<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(defineProps<{ initialCount?: number }>(), { initialCount: 0 });
const count = ref(props.initialCount);
</script>

<template>
  <v-row align="center" no-gutters>
    <v-col cols="auto">
      <v-btn color="primary" @click="count += 1">Count is {{ count }}</v-btn>
    </v-col>
    <v-col cols="auto" class="ml-4">
      <span class="text-body-2 text-medium-emphasis">Vuetify + Vue state</span>
    </v-col>
  </v-row>
</template>
