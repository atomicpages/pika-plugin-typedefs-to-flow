# pika-plugin-typedefs-to-flow

A @pika/pack plugin to convert typescript definitions to flow types.

## Usage

```sh
npm i flowgen pika-plugin-typedefs-to-flow
```

When creating your pipeline, be sure `pika-plugin-typedefs-to-flow` us used after `@pika/plugin-ts-standard-pkg`.

```json
{
    "@pika/pack": {
        "pipeline": [
            [
                "@pika/plugin-ts-standard-pkg"
            ],
            [
                "pika-plugin-typedefs-to-flow"
            ]
        ]
    }
}
```

### Options

| Option           | Type    | Default Value | Description                             |
|------------------|---------|---------------|-----------------------------------------|
| tolerateFailures | boolean |               | Tolerate errors thrown from flowgen.    |
| beautify         | boolean | true          | Disable flow definition beautification. |
| flowgen          | Object  |               | Pass custom options to flowgen          |

#### `flowgen` Options

| Option           | Type    | Default Value | Description                                                                                |
|------------------|---------|---------------|--------------------------------------------------------------------------------------------|
| flowTypedFormat  | boolean |               | Format output so it fits in the flow-typed repo.                                           |
| compileTests     | boolean |               | Compile any sibling -tests.ts files found.                                                 |
| noModuleExports  | boolean |               | Convert `export = Type` only to default export, instead of `declare module.exports: Type`. |
| interfaceRecords | boolean |               | Convert TypeScript interfaces to Exact Objects.                                            |
| noJSDoc          | boolean |               | Ignore TypeScript JSDoc.                                                                   |
| addFlowHeader    | boolean | true          | Add `// @flow` to generated files. Should be used for libs.
