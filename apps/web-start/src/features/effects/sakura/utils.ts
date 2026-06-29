export type SpriteCache = Map<string, HTMLCanvasElement>;

export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomItem<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
