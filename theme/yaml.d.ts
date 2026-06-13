// Tell TypeScript that *.yaml imports return `unknown` (the plugin parses them).
// Specific types are applied at the resolver layer in setup/data.ts.
declare module '*.yaml' {
  const content: unknown
  export default content
}
