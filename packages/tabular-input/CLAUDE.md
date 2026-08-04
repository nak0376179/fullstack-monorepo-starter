# @repo/tabular-input

Framework-agnostic core: parse header-required CSV/TSV text → validate against a schema → serialize to JSON/CSV. No deps, no framework imports. Consumed by react-app (MUI) and vue-app (Vuetify) UI samples.

## API (src/index.ts re-exports everything)

```ts
processTable(text, schema, opts?) => ProcessResult
// opts: { delimiter?: ","|"\t"|"auto"(default), maxErrors?: number(default 10) }
// ProcessResult: { ok, records: TableRecord[], errors: ValidationError[](≤maxErrors),
//                  totalErrorCount, delimiter }
toJson(records, schema, indent=2) => string
toCsv(records, schema, delimiter=",") => string
// Validator factories: maxLength(n) minLength(n) email()
//   charset("digits"|"alphanumeric"|"katakana"|"hiragana") pattern(re, msgSuffix)
// FieldDef: { key, label, required, validators?: Validator[] }
// Validator: (value, {field, row}) => string|null  // null = pass
```

## Invariants (do not break)

- Header row required. Header cell matches FieldDef by `key` OR `label` (trimmed).
- Delimiter auto-detected from header line (tab count ≥ comma count → TSV).
- Output column/key order = schema definition order, regardless of input column order.
- JSON output omits fields whose column was absent from input; CSV outputs all schema fields (absent → empty).
- Errors capped at maxErrors (10); `totalErrorCount` keeps the true count. Error rows are 1-based source-text line numbers (header = 1).
- Cell values are trimmed before validation. Empty optional value skips validators. Per field, only the FIRST failing validator reports.
- Header errors (unknown/duplicate/missing-required column) abort: records = [].
- Fully empty data rows are skipped silently. Row with wrong column count → row error, row skipped.
- All error messages are Japanese; validators build them from `field.label`.

## Files

- `src/types.ts` types · `parse.ts` RFC4180-ish parser + delimiter detect · `validators.ts` factories · `process.ts` orchestration · `serialize.ts` toJson/toCsv · `sampleSchema.ts` demo schema (userImportSchema) + sample texts

## Consumers — keep in feature parity

- `apps/react-app/src/components/TabularImport.tsx` (MUI)
- `apps/vue-app/src/components/TabularImport.vue` (Vuetify)
- Same UX in both: textarea → sample buttons → JSON/CSV radio → convert button → success alert + readonly output, or error list ("…ほかN件" when totalErrorCount > shown). A change to one UI must be mirrored in the other. Each has a `.test` and `.stories` file.

## Gotchas

- Package ships raw TS (`exports: ./src/index.ts`); apps' bundlers/tsc compile it. No build step.
- Code must pass strict + noUncheckedIndexedAccess (apps typecheck it with their own tsconfig).
- ESLint `no-irregular-whitespace` forbids literal U+3000 in source → regexes use `\s` (which matches U+3000) instead.
- vue-app tests need the ResizeObserver stub in `apps/vue-app/src/test/setup.ts` (Vuetify v-textarea auto-grow).
- Verify: `pnpm --filter @repo/tabular-input test` (core), `pnpm test|lint|typecheck` at root for all.
