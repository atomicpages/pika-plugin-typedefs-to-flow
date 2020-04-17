import fs from 'fs';
import path from 'path';
import glob from 'glob';
import mkdirp from 'mkdirp';

import { BuilderOptions, MessageError } from '@pika/types';

// @ts-ignore
import { compiler, beautify } from 'flowgen';

interface Options extends BuilderOptions {
    options: {
        flowgen?: {
            /**
             * Format output so it fits in the flow-typed repo.
             */
            flowTypedFormat?: boolean;

            /**
             * Compile any sibling <filename>-tests.ts files found.
             */
            compileTests?: boolean;

            /**
             * Convert `export = Type` only to default export,
             * instead of `declare module.exports: Type`.
             */
            noModuleExports?: boolean;

            /**
             * Convert TypeScript interfaces to Exact Objects.
             */
            interfaceRecords?: boolean;

            /**
             * Ignore TypeScript JSDoc.
             */
            noJSDoc?: boolean;

            /**
             * Add `// @flow` to generated files. Should be used for libs.
             */
            addFlowHeader?: boolean;
        };

        /**
         * Tolerate errors thrown from flowgen.
         */
        tolerateFailures?: boolean;

        /**
         * Disable flow definition beautification.
         */
        beautify?: boolean;

        /**
         * Set debugging output.
         */
        debug?: boolean;
    };
}

const debugging = (reporter: Options['reporter'], debug?: boolean) => {
    const logger = (message: string) => {
        if (debug) {
            reporter.info(message);
        }
    };

    return logger;
};

export async function build({ out, options = {}, reporter }: Options): Promise<void> {
    const debug = debugging(reporter, options.debug);

    if (!fs.existsSync(path.join(out, 'dist-types'))) {
        throw new MessageError(
            'Missing dist-types. Did you forgot to use pika-plugin-typedefs-to-flow after @pika/plugin-ts-standard-pkg?'
        );
    }

    const defaultOptions = {
        flowgen: { addFlowHeader: true },
        beautify: true,
        ...options,
    };

    const files = glob.sync(path.normalize(path.join(out, 'dist-types/**/*.d.ts')));
    const writePath = path.join(out, 'dist-flow');

    // strips `out` path part and gives us something like component/x/index.d.ts
    const replacePath = path.normalize(path.join(out + '/dist-types/'));

    let failures = 0;

    files.forEach(file => {
        const basename = path.basename(file);
        const dir = path.dirname(path.join(writePath, file.replace(replacePath, '')));

        reporter.info(`Converting ${basename}`);
        debug(`Using dir ${dir}`);

        try {
            let def = compiler.compileDefinitionFile(file, defaultOptions.flowgen);

            if (defaultOptions.beautify) {
                def = beautify(def);
            }

            if (!fs.existsSync(dir)) {
                mkdirp.sync(dir);
            }

            debug(`Writing file ${path.join(dir, basename.replace('.d.ts', '.js.flow'))}`);
            fs.writeFileSync(path.join(dir, basename.replace('.d.ts', '.js.flow')), def);
        } catch (e) {
            failures++;

            if (!options.tolerateFailures) {
                throw new Error(e);
            } else {
                reporter.warning(e.message);
            }
        }
    });

    reporter.success(
        `Successfully converted ${files.length - 1 - failures}. Failed to convert ${failures}.`
    );

    reporter.created(writePath);
}
