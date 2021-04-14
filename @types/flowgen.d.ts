declare module 'flowgen' {
    export type Options = {
        jsdoc?: boolean;
        interfaceRecords?: boolean;
        moduleExports?: boolean;
        quiet?: boolean;
        inexact?: boolean;
    };

    export type Compiler = {
        compileTest(path: string, target: string): void;
        compileDefinitionString(
            string: string,
            options?: Options,
            mapSourceCode?: (source: string | void, fileName: string) => string | void
        ): string;
        compileDefinitionFile(
            path: string,
            options?: Options,
            mapSourceCode?: (source: string | void, fileName: string) => string | void
        ): string;

        // Low-level exports
        reset(options?: Options): void;
        setChecker(checker: any): void;
        compile(sourceFile: any): string;
    };

    type Flowgen = {
        beautify(str: string): string;
        compiler: Compiler;
    };

    export const compiler: Flowgen['compiler'];
    export const beautify: Flowgen['beautify'];

    export default Flowgen;
}
