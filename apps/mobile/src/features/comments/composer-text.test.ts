import { describe, expect, it } from 'vitest';

import {
    activeMentionQuery,
    caretAfterChange,
    insertMention,
    insertSpoiler,
    startMention,
} from './composer-text';

const at = (position: number) => ({ start: position, end: position });

describe('activeMentionQuery', () => {
    it('finds the name being typed before the caret', () => {
        expect(activeMentionQuery('hi @ole', at(7))).toEqual({
            start: 3,
            query: 'ole',
        });
        expect(activeMentionQuery('@', at(1))).toEqual({
            start: 0,
            query: '',
        });
        expect(activeMentionQuery('a\n@x_y', at(6))).toEqual({
            start: 2,
            query: 'x_y',
        });
    });

    it('ignores emails, finished mentions and selections', () => {
        expect(activeMentionQuery('mail@host', at(9))).toBeNull();
        expect(activeMentionQuery('@olexh ', at(7))).toBeNull();
        expect(activeMentionQuery('@olexh', { start: 0, end: 6 })).toBeNull();
        expect(activeMentionQuery('[@olexh', at(7))).toBeNull();
    });
});

describe('insertMention', () => {
    it('completes the typed name with a trailing space', () => {
        const text = 'hi @ole';
        expect(
            insertMention(text, { start: 3, query: 'ole' }, 7, 'olexh'),
        ).toEqual({ text: 'hi @olexh ', selection: at(10) });
    });

    it('keeps the text after the caret without doubling a space', () => {
        expect(
            insertMention('@ol and', { start: 0, query: 'ol' }, 3, 'olexh'),
        ).toEqual({ text: '@olexh and', selection: at(7) });
    });
});

describe('startMention', () => {
    it('adds an @ at the caret, spaced from a word', () => {
        expect(startMention('', at(0))).toEqual({
            text: '@',
            selection: at(1),
        });
        expect(startMention('hi', at(2))).toEqual({
            text: 'hi @',
            selection: at(4),
        });
        expect(startMention('hi ', at(3))).toEqual({
            text: 'hi @',
            selection: at(4),
        });
    });
});

describe('insertSpoiler', () => {
    it('wraps a short selection inline', () => {
        expect(insertSpoiler('he dies', { start: 3, end: 7 })).toEqual({
            text: 'he :spoiler[dies]',
            selection: at(17),
        });
    });

    it('keeps an inline spoiler apart from a colon', () => {
        expect(insertSpoiler('a:b', { start: 2, end: 3 }).text).toBe(
            'a: :spoiler[b]',
        );
    });

    it('wraps a multi-line selection in a block on its own lines', () => {
        expect(insertSpoiler('x one\ntwo y', { start: 2, end: 9 })).toEqual({
            text: 'x \n:::spoiler\none\ntwo\n:::\n y',
            selection: at(25),
        });
    });

    it('opens an empty block with the caret inside', () => {
        expect(insertSpoiler('', at(0))).toEqual({
            text: ':::spoiler\n\n:::',
            selection: at(11),
        });
        expect(insertSpoiler('text', at(4))).toEqual({
            text: 'text\n:::spoiler\n\n:::',
            selection: at(16),
        });
    });

    it('uses a block when the selection holds a closing bracket', () => {
        expect(insertSpoiler('[a]', { start: 0, end: 3 }).text).toBe(
            ':::spoiler\n[a]\n:::',
        );
    });
});

describe('caretAfterChange', () => {
    it('lands after a paste into an empty field', () => {
        expect(caretAfterChange('', 'Привіт')).toBe(6);
    });

    it('lands after text pasted in the middle', () => {
        expect(caretAfterChange('ab', 'aXYZb')).toBe(4);
    });

    it('lands after an autocorrected word', () => {
        expect(caretAfterChange('teh end', 'the end')).toBe(3);
    });

    it('lands at the cut after a deletion', () => {
        expect(caretAfterChange('abcdef', 'abef')).toBe(2);
    });
});
