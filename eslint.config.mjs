import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // 👇 The Magic Line: Ignore EVERYTHING
    ignores: ["**/*"],
  },
]);