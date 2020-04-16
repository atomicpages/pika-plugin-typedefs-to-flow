const fs = require('fs');
const path = require('path');

const pkg = path.join(__dirname, 'pkg');
const folders = fs.readdirSync(pkg);

const ANSI_CHECK = '✔';
const ANSI_CROSS = '✘';

const assert = (assertion, ...messages) => {
    if (!assertion) {
        console.error(ANSI_CROSS, messages.length > 1 ? messages[1] : messages[0]);
        throw new Error(messages);
    }

    console.log(ANSI_CHECK, messages.length > 1 ? messages[1] : messages[0]);
};

try {
    console.log('Running unit tests\n');

    assert(fs.existsSync(pkg), 'pkg/ directory expected to exist', 'pkg/ directory exists');
    assert(folders.includes('dist-flow'), 'dist-flow/ directory exists');

    assert(
        fs.readFileSync(path.join(pkg, 'dist-flow', 'Statistics.js.flow')).toString() ===
            `declare export function sum(a: number, b: number): number;
declare export function sum(...args: number[]): number;
declare export function max(a: number, b: number): number;
declare export function max(...args: number[]): number;
declare export function min(a: number, b: number): number;
declare export function min(...args: number[]): number;
declare export function average(...args: number[]): number;
declare export function stddev(sample?: number, ...args: number[]): any;
declare export function stddev(...args: number[]): any;
`,
        'should contain the correct flow definitions'
    );
} catch (e) {
    console.error(e.messages);
    process.exit(1);
}
