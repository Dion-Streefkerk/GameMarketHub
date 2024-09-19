import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        root: "../../src/",
        setupFiles: [
            "./tests/src/setup.ts"
        ],
        coverage: {
            provider: "istanbul",
            reporter: ["text", "text-summary", "html"],
            reportsDirectory: "./tests/coverage"
        },
    },
});
