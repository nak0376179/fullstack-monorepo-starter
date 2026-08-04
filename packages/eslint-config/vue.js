import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import { baseConfig } from "./base.js";

export default [
  ...baseConfig,
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
