<script setup lang="ts">
import { ref } from "vue";
import {
  processTable,
  sampleCsvText,
  sampleInvalidCsvText,
  sampleTsvText,
  toCsv,
  toJson,
  userImportSchema,
  type ProcessResult,
} from "@repo/tabular-input";

type OutputFormat = "json" | "csv";

const columnsHint = userImportSchema
  .map((f) => `${f.label}(${f.key})${f.required ? " *必須" : ""}`)
  .join(" / ");

const input = ref("");
const format = ref<OutputFormat>("json");
const result = ref<ProcessResult | null>(null);
const output = ref("");

function convert(text: string, fmt: OutputFormat) {
  const res = processTable(text, userImportSchema);
  result.value = res;
  output.value = res.ok
    ? fmt === "json"
      ? toJson(res.records, userImportSchema)
      : toCsv(res.records, userImportSchema)
    : "";
}

function handleFormatChange(fmt: OutputFormat) {
  format.value = fmt;
  if (result.value?.ok) convert(input.value, fmt);
}
</script>

<template>
  <v-card variant="outlined">
    <v-card-text>
      <h2 class="text-h6 mb-2">CSV / TSV 取り込みサンプル</h2>
      <p class="text-body-2 text-medium-emphasis mb-4">
        ヘッダ行必須(カラム名は key・ラベルのどちらでも可)。区切り文字は自動判定します。
        <br />
        カラム: {{ columnsHint }}
      </p>

      <v-textarea
        v-model="input"
        label="CSV / TSV 入力"
        rows="8"
        auto-grow
        variant="outlined"
        placeholder="name,email&#10;山田 太郎,taro@example.com"
        class="font-mono"
      />

      <div class="d-flex ga-2 mb-4">
        <v-btn size="small" variant="outlined" @click="input = sampleCsvText">CSVサンプル</v-btn>
        <v-btn size="small" variant="outlined" @click="input = sampleTsvText">TSVサンプル</v-btn>
        <v-btn size="small" variant="outlined" @click="input = sampleInvalidCsvText">
          エラーサンプル
        </v-btn>
      </div>

      <div class="d-flex align-center ga-4 mb-4">
        <span id="output-format-label" class="text-body-2">出力形式</span>
        <v-radio-group
          :model-value="format"
          inline
          hide-details
          density="compact"
          aria-labelledby="output-format-label"
          @update:model-value="handleFormatChange($event as OutputFormat)"
        >
          <v-radio label="JSON" value="json" density="compact" />
          <v-radio label="CSV" value="csv" density="compact" />
        </v-radio-group>
        <v-spacer />
        <v-btn color="primary" @click="convert(input, format)">検証して変換</v-btn>
      </div>

      <v-alert v-if="result && !result.ok" type="error" variant="tonal" class="mb-4">
        <p class="text-body-2 font-weight-bold mb-1">
          {{ result.totalErrorCount }}件のエラーがあります
        </p>
        <ul class="text-body-2 pl-5">
          <li v-for="(err, i) in result.errors" :key="i">
            <template v-if="err.row !== null">{{ err.row }}行目: </template>{{ err.message }}
          </li>
        </ul>
        <p v-if="result.totalErrorCount > result.errors.length" class="text-body-2 mb-0">
          …ほか {{ result.totalErrorCount - result.errors.length }} 件
        </p>
      </v-alert>

      <template v-if="result?.ok">
        <v-alert type="success" variant="tonal" class="mb-4">
          {{ result.records.length }}件のデータを {{ format.toUpperCase() }} に変換しました
        </v-alert>
        <v-textarea
          :model-value="output"
          :label="`出力(${format.toUpperCase()})`"
          rows="6"
          auto-grow
          readonly
          variant="outlined"
          class="font-mono"
        />
      </template>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.font-mono :deep(textarea) {
  font-family: monospace;
  font-size: 13px;
}
</style>
