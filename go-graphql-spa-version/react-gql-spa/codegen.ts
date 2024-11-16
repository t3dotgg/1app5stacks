import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://roundest-go.fly.dev/graphql",
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  // documents: ["src/**/*.{ts,tsx}"],
  documents: "src/**/*.graphql",
  generates: {
    "./__generated__/": {
      preset: "client",

      // presetConfig: {
      //   gqlTagName: "gql",
      // },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
