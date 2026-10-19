// Compiles the web design tokens (apps/web/src/globals.css: colors, radii, card shadow) to plain values for Uniwind; React Native parses neither oklch nor relative colors.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { converter, formatHex, formatHex8, parse } from 'culori';

const SOURCE = fileURLToPath(
    new URL('../../web/src/globals.css', import.meta.url),
);
const TARGET = fileURLToPath(new URL('../src/theme.css', import.meta.url));
const MODERN_COLOR_SUPPORTS = [
    '@supports (color: oklch(from red l c h))',
    '@supports (color: color-mix(in lab, red, red))',
];

function stripComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function readBlocks(css) {
    const blocks = [];
    let depth = 0;
    let start = 0;
    let bodyStart = 0;
    let selector = '';
    for (let i = 0; i < css.length; i++) {
        const char = css[i];
        if (char === '{') {
            if (depth === 0) {
                selector = css.slice(start, i).trim();
                bodyStart = i + 1;
            }
            depth++;
        } else if (char === '}') {
            depth--;
            if (depth === 0) {
                blocks.push({ selector, body: css.slice(bodyStart, i) });
                start = i + 1;
            }
        } else if (char === ';' && depth === 0) {
            start = i + 1;
        }
    }
    return blocks;
}

function readDeclarations(body) {
    const declarations = {};
    for (const part of body.split(';')) {
        const match = part.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/);
        if (match) declarations[match[1]] = match[2].replace(/\s+/g, ' ');
    }
    return declarations;
}

function collectThemes(css) {
    const blocks = readBlocks(stripComments(css));
    const base = {};
    const dark = {};
    const relativeLight = {};
    const relativeDark = {};
    const mapping = {};

    for (const { selector, body } of blocks) {
        if (selector === '@theme inline')
            Object.assign(mapping, readDeclarations(body));
        else if (selector === '@theme static')
            Object.assign(base, readDeclarations(body));
        else if (selector === ':root')
            Object.assign(base, readDeclarations(body));
        else if (selector === '.dark')
            Object.assign(dark, readDeclarations(body));
    }
    for (const { selector, body } of blocks) {
        if (!MODERN_COLOR_SUPPORTS.includes(selector)) continue;
        for (const inner of readBlocks(body)) {
            const target = inner.selector.startsWith('.dark')
                ? relativeDark
                : relativeLight;
            Object.assign(target, readDeclarations(inner.body));
        }
    }

    return {
        mapping,
        light: { ...base, ...relativeLight },
        dark: { ...base, ...dark, ...relativeLight, ...relativeDark },
    };
}

function evaluateChannel(expression, channels) {
    const source = expression.replace(/^calc\((.*)\)$/, '$1');
    if (!/^[lch\d.\s*+\-/()]+$/.test(source)) {
        throw new Error(`Unsupported channel expression: ${expression}`);
    }
    return new Function('l', 'c', 'h', `return (${source});`)(
        channels.l,
        channels.c,
        channels.h,
    );
}

function splitChannels(text) {
    const parts = [];
    let depth = 0;
    let current = '';
    for (const char of text.trim()) {
        if (char === '(') depth++;
        if (char === ')') depth--;
        if (char === ' ' && depth === 0) {
            if (current) parts.push(current);
            current = '';
        } else current += char;
    }
    if (current) parts.push(current);
    return parts;
}

function resolve(name, vars, seen = new Set()) {
    if (seen.has(name)) throw new Error(`Cycle at ${name}`);
    const value = vars[name];
    if (value === undefined) return undefined;
    return resolveValue(value, vars, new Set([...seen, name]));
}

function resolveValue(value, vars, seen) {
    const reference = value.match(/^var\((--[\w-]+)\)$/);
    if (reference) return resolve(reference[1], vars, seen);

    const relative = value.match(/^oklch\(from var\((--[\w-]+)\) (.+)\)$/);
    if (relative) {
        const origin = resolve(relative[1], vars, seen);
        if (!origin) return undefined;
        const { l, c, h = 0 } = toOklch(origin);
        const [channels, alpha] = relative[2].split(' / ');
        const [nl, nc, nh] = splitChannels(channels).map((part) =>
            evaluateChannel(part, { l, c, h }),
        );
        return {
            mode: 'oklch',
            l: nl,
            c: nc,
            h: nh,
            alpha: alpha === undefined ? 1 : Number(alpha),
        };
    }

    const mix = value.match(
        /^color-mix\(in oklab, var\((--[\w-]+)\) ([\d.]+)%, transparent\)$/,
    );
    if (mix) {
        const origin = resolve(mix[1], vars, seen);
        if (!origin) return undefined;
        return {
            ...origin,
            alpha: (origin.alpha ?? 1) * (Number(mix[2]) / 100),
        };
    }

    return parse(value) ?? undefined;
}

function toOklch(color) {
    return color.mode === 'oklch' ? color : converter('oklch')(color);
}

function toHex(color) {
    return color.alpha !== undefined && color.alpha < 1
        ? formatHex8(color)
        : formatHex(color);
}

function buildTheme(mapping, vars) {
    const lines = [];
    for (const [name, value] of Object.entries(mapping)) {
        if (!name.startsWith('--color-')) continue;
        const color = resolveValue(value, vars, new Set());
        if (color) lines.push(`${name}: ${toHex(color)};`);
    }
    for (const token of [
        '--brand',
        '--surface',
        '--surface-glass',
        '--surface-inset',
        '--surface-inset-border',
    ]) {
        const color = resolve(token, vars);
        if (color) lines.push(`--color-${token.slice(2)}: ${toHex(color)};`);
    }
    for (const [name, value] of Object.entries(mapping)) {
        if (name.startsWith('--radius-'))
            lines.push(`${name}: ${resolveLength(value, vars)}px;`);
    }
    if (vars['--shadow-card']) {
        lines.push(`--shadow-card: ${resolveShadow(vars['--shadow-card'])};`);
    }
    return lines;
}

const REM = 16;

function resolveLength(value, vars) {
    const expression = value
        .replace(/^calc\((.*)\)$/, '$1')
        .replace(/var\((--[\w-]+)\)/g, (_, name) => vars[name])
        .replace(/([\d.]+)rem/g, (_, n) => String(Number(n) * REM))
        .replace(/([\d.]+)px/g, '$1');
    if (!/^[\d.\s+\-*/]+$/.test(expression)) {
        throw new Error(`Unsupported length: ${value}`);
    }
    return new Function(`return (${expression});`)();
}

function resolveShadow(value) {
    return value
        .split(/,(?![^(]*\))/)
        .map((layer) => {
            const parts = splitChannels(layer);
            const color = resolveValue(parts.pop(), {}, new Set());
            return [...parts, toHex(color)].join(' ');
        })
        .join(', ');
}

const { mapping, light, dark } = collectThemes(readFileSync(SOURCE, 'utf8'));
const indent = (lines) => lines.map((line) => `            ${line}`).join('\n');

writeFileSync(
    TARGET,
    `/* Generated by scripts/generate-tokens.mjs from apps/web/src/globals.css. Run \`pnpm tokens\`; do not edit. */
@layer theme {
    :root {
        @variant light {
${indent(buildTheme(mapping, light))}
        }

        @variant dark {
${indent(buildTheme(mapping, dark))}
        }
    }
}
`,
);
