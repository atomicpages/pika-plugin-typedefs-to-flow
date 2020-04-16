export function sum(a: number, b: number): number;
export function sum(...args: number[]): number;

export function sum(...args: number[]) {
    let result = 0;

    for (let i = 0; i < args.length; i++) {
        result += args[i];
    }

    return result;
}

export function max(a: number, b: number): number;
export function max(...args: number[]): number;

export function max(...args: number[]) {
    let max = -Infinity;

    for (let i = 0; i < args.length; i++) {
        if (max < args[i]) {
            max = args[i];
        }
    }

    return max;
}

export function min(a: number, b: number): number;
export function min(...args: number[]): number;

export function min(...args: number[]) {
    let min = Infinity;

    for (let i = 0; i < args.length; i++) {
        if (min > args[i]) {
            min = args[i];
        }
    }

    return min;
}

export function average(...args: number[]) {
    return sum(...args) / args.length;
}

export function stddev(sample?: number, ...args: number[]);
export function stddev(...args: number[]);

export function stddev(sample?: number, ...args: number[]) {
    const mean = sample || average(...args);
    let sum = 0;

    for (let i = 0; i < args.length; i++) {
        sum += Math.pow(args[i] - mean, 2);
    }

    return Math.sqrt(sum / args.length);
}
