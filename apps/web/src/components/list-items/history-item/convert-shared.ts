import type { HistoryFact, HistoryFactPart } from './types';

type Piece = HistoryFactPart | HistoryFact | string | number;

const NBSP = '\u00A0';
const BOUND_SPACE = /(?<=(?:^|[\s\u00A0])(?:в|у|з|із|зі|до|на)|\d) /giu;

export const value = (text: string | number): HistoryFactPart => ({
    type: 'value',
    text: String(text),
});

export const status = (text: string): HistoryFactPart => ({
    type: 'status',
    text,
});

const bindWords = (parts: HistoryFactPart[]): HistoryFact =>
    parts.map((part, index) => {
        if (part.type !== 'text') return part;

        let text = part.text.replace(BOUND_SPACE, NBSP);
        if (parts[index - 1]?.type === 'value' && text.startsWith(' ')) {
            text = NBSP + text.slice(1);
        }

        return { ...part, text };
    });

export function fact(
    strings: TemplateStringsArray,
    ...pieces: Piece[]
): HistoryFact {
    const parts: HistoryFactPart[] = [];

    const push = (part: HistoryFactPart) => {
        const last = parts.at(-1);

        if (!part.text) return;
        if (part.type === 'text' && last?.type === 'text') {
            parts[parts.length - 1] = { ...last, text: last.text + part.text };
            return;
        }

        parts.push(part);
    };

    strings.forEach((text, index) => {
        push({ type: 'text', text });

        if (index >= pieces.length) return;

        const piece = pieces[index];
        if (Array.isArray(piece)) piece.forEach(push);
        else if (typeof piece === 'object') push(piece);
        else push({ type: 'text', text: String(piece) });
    });

    return bindWords(parts);
}

export const joinFacts = (facts: HistoryFact[], separator: string) =>
    facts.reduce<HistoryFact>(
        (joined, item, index) =>
            index === 0 ? item : fact`${joined}${separator}${item}`,
        [],
    );

export const capitalizeFirst = (facts: HistoryFact[]): HistoryFact[] =>
    facts.map((item, index) => {
        const [first, ...rest] = item;

        if (index > 0 || first?.type !== 'text') return item;

        return [
            {
                ...first,
                text: first.text[0].toUpperCase() + first.text.slice(1),
            },
            ...rest,
        ];
    });

export const into = (word: string) => (/^[вф]/iu.test(word) ? 'у' : 'в');

export const outOf = (word: string) => (/^[зсшжчщ]/iu.test(word) ? 'із' : 'з');
