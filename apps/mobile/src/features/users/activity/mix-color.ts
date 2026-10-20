const HEX = /^#([0-9a-f]{6})$/i;

const channels = (hex: string) => {
    const match = HEX.exec(hex);
    if (!match) return undefined;

    const value = Number.parseInt(match[1], 16);

    return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const;
};

/** `accent` laid over `base` at `amount` (0 to 1) as one hex colour; the tokens are hex, anything else gives `accent`. */
export function mixHex(base: string, accent: string, amount: number) {
    const from = channels(base);
    const to = channels(accent);
    if (!from || !to) return accent;

    const mixed = from.map((channel, index) =>
        Math.round(channel + (to[index] - channel) * amount),
    );

    return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}
