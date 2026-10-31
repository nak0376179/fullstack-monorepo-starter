import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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

export function TabularImport() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<OutputFormat>("json");
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [output, setOutput] = useState("");

  const convert = (text: string, fmt: OutputFormat) => {
    const res = processTable(text, userImportSchema);
    setResult(res);
    setOutput(
      res.ok
        ? fmt === "json"
          ? toJson(res.records, userImportSchema)
          : toCsv(res.records, userImportSchema)
        : "",
    );
  };

  const handleFormatChange = (fmt: OutputFormat) => {
    setFormat(fmt);
    if (result?.ok) convert(input, fmt);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">CSV / TSV 取り込みサンプル</Typography>
          <Typography variant="body2" color="text.secondary">
            ヘッダ行必須(カラム名は key・ラベルのどちらでも可)。区切り文字は自動判定します。
            <br />
            カラム: {columnsHint}
          </Typography>

          <TextField
            label="CSV / TSV 入力"
            multiline
            minRows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"name,email\n山田 太郎,taro@example.com"}
            slotProps={{ htmlInput: { style: { fontFamily: "monospace", fontSize: 13 } } }}
          />

          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => setInput(sampleCsvText)}>
              CSVサンプル
            </Button>
            <Button size="small" variant="outlined" onClick={() => setInput(sampleTsvText)}>
              TSVサンプル
            </Button>
            <Button size="small" variant="outlined" onClick={() => setInput(sampleInvalidCsvText)}>
              エラーサンプル
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <FormLabel id="output-format-label">出力形式</FormLabel>
            <RadioGroup
              row
              aria-labelledby="output-format-label"
              value={format}
              onChange={(e) => handleFormatChange(e.target.value as OutputFormat)}
            >
              <FormControlLabel value="json" control={<Radio size="small" />} label="JSON" />
              <FormControlLabel value="csv" control={<Radio size="small" />} label="CSV" />
            </RadioGroup>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={() => convert(input, format)}>
              検証して変換
            </Button>
          </Stack>

          {result && !result.ok && (
            <Alert severity="error">
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {result.totalErrorCount}件のエラーがあります
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {result.errors.map((err, i) => (
                  <li key={i}>
                    <Typography variant="body2">
                      {err.row !== null ? `${err.row}行目: ` : ""}
                      {err.message}
                    </Typography>
                  </li>
                ))}
              </Box>
              {result.totalErrorCount > result.errors.length && (
                <Typography variant="body2">
                  …ほか {result.totalErrorCount - result.errors.length} 件
                </Typography>
              )}
            </Alert>
          )}

          {result?.ok && (
            <>
              <Alert severity="success">
                {result.records.length}件のデータを {format.toUpperCase()} に変換しました
              </Alert>
              <TextField
                label={`出力(${format.toUpperCase()})`}
                multiline
                minRows={6}
                value={output}
                slotProps={{
                  input: { readOnly: true },
                  htmlInput: { style: { fontFamily: "monospace", fontSize: 13 } },
                }}
              />
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
