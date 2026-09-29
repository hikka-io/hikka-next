import { describe, expect, it } from 'vitest';

import { BLANK_CHARS, POSITIVE_INTEGER_PATTERN } from './text';

const ZWSP = '\u200B';
const BOM = '\uFEFF';

describe('BLANK_CHARS', () => {
    it('strips a lone zero-width space', () => {
        expect(ZWSP.replace(BLANK_CHARS, '')).toBe('');
    });

    it('strips a lone byte order mark', () => {
        expect(BOM.replace(BLANK_CHARS, '')).toBe('');
    });

    it('strips a mix of invisible characters and whitespace', () => {
        expect(`${ZWSP} ${BOM}\n\t`.replace(BLANK_CHARS, '')).toBe('');
    });

    it('strips regular whitespace on its own', () => {
        expect(' \n\t\r '.replace(BLANK_CHARS, '')).toBe('');
    });

    it('removes invisible characters from inside text and keeps the text', () => {
        expect(`a${ZWSP}b`.replace(BLANK_CHARS, '')).toBe('ab');
        expect(`${BOM}text${ZWSP}`.replace(BLANK_CHARS, '')).toBe('text');
    });

    it('matches the same characters as the literal class it replaced', () => {
        const literal = new RegExp(
            `[\\s${String.fromCharCode(0x200b, 0xfeff)}]`,
            'g',
        );
        const samples = [
            '',
            ZWSP,
            BOM,
            `${ZWSP}${BOM}`,
            ` ${ZWSP}${BOM}\n\t`,
            `a${ZWSP}b`,
            `${BOM}a b${ZWSP}`,
            '\u00A0text\u00A0',
            'plain text',
            '\u200Ctext\u200D',
        ];

        for (const sample of samples) {
            expect(sample.replace(BLANK_CHARS, '')).toBe(
                sample.replace(literal, ''),
            );
        }
    });
});

describe('POSITIVE_INTEGER_PATTERN', () => {
    it.each(['1', '10', '2024'])('accepts %s', (value) => {
        expect(POSITIVE_INTEGER_PATTERN.test(value)).toBe(true);
    });

    it.each(['', '0', '01', '-1', '1.5', 'a1'])('rejects %j', (value) => {
        expect(POSITIVE_INTEGER_PATTERN.test(value)).toBe(false);
    });
});
