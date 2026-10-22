import { describe, expect, it } from 'vitest';

import type { CommentResponse } from '@hikka/api';

import {
    commentExcerpt,
    commentReplyTarget,
    commentTextLength,
    commentThreadTitle,
    mentionMarkdown,
    normalizeCommentText,
    parseCommentMentions,
    serializeCommentMentions,
    spoilerBlock,
    spoilerInline,
    userMentionMarkdown,
} from './comment-text';

const SITE = 'https://hikka.io';
const REF = '0b8b2c1e-1d1e-4a52-9d2a-1f7a6c2b9e10';

const reply = (depth: number, parent: string | null = 'parent') =>
    ({
        reference: 'comment',
        parent,
        depth,
        author: { username: 'second_user' },
    }) as unknown as CommentResponse;

describe('normalizeCommentText', () => {
    it('trims surrounding whitespace', () => {
        expect(normalizeCommentText('  hello \n')).toBe('hello');
    });

    it('is empty for whitespace and zero-width characters only', () => {
        expect(normalizeCommentText(' \n\t ')).toBe('');
        expect(normalizeCommentText('​')).toBe('');
        expect(normalizeCommentText('﻿ ​\n')).toBe('');
    });

    it('keeps inner whitespace', () => {
        expect(normalizeCommentText('a\n\nb')).toBe('a\n\nb');
    });
});

describe('commentTextLength', () => {
    it('counts code points, so an emoji is one character', () => {
        expect(commentTextLength('ab')).toBe(2);
        expect(commentTextLength('😀')).toBe(1);
        expect(commentTextLength('привіт')).toBe(6);
    });
});

describe('mention markdown', () => {
    it('writes the label raw, without escaping underscores', () => {
        expect(mentionMarkdown('@second_user', `${SITE}/u/x`)).toBe(
            '[@second_user](https://hikka.io/u/x)',
        );
    });

    it('points a user mention at the reference', () => {
        expect(
            userMentionMarkdown(SITE, {
                username: 'olexh',
                reference: REF,
            }),
        ).toBe(`[@olexh](${SITE}/u/${REF})`);
    });
});

describe('spoilers', () => {
    it('builds the inline and block directives the viewer reads', () => {
        expect(spoilerInline('Снейп')).toBe(':spoiler[Снейп]');
        expect(spoilerBlock('line 1\nline 2')).toBe(
            ':::spoiler\nline 1\nline 2\n:::',
        );
    });
});

describe('commentReplyTarget', () => {
    it('nests under the comment below the limit', () => {
        expect(commentReplyTarget(reply(1, null))).toEqual({
            parent: 'comment',
            mention: '',
        });
        expect(commentReplyTarget(reply(4))).toEqual({
            parent: 'comment',
            mention: '',
        });
    });

    it('attaches to the parent with a mention at the limit', () => {
        expect(commentReplyTarget(reply(5))).toEqual({
            parent: 'parent',
            mention: '@second_user ',
        });
    });
});

describe('parseCommentMentions', () => {
    it('turns mention links into plain usernames', () => {
        expect(
            parseCommentMentions(`Hi [@olexh](${SITE}/u/${REF}), look`),
        ).toEqual({
            text: 'Hi @olexh, look',
            mentions: [{ username: 'olexh', reference: REF }],
        });
    });

    it('falls back to the username for a link by name', () => {
        expect(
            parseCommentMentions(`[@second_user](${SITE}/u/second_user)`),
        ).toEqual({
            text: '@second_user',
            mentions: [{ username: 'second_user', reference: 'second_user' }],
        });
    });

    it('keeps a link glued to a word as typed, so it round-trips', () => {
        const markdown = `foo[@olexh](${SITE}/u/${REF}) and [@olexh](${SITE}/u/${REF})`;
        const { text, mentions } = parseCommentMentions(markdown);

        expect(text).toBe(`foo[@olexh](${SITE}/u/${REF}) and @olexh`);
        expect(serializeCommentMentions(text, mentions, SITE)).toBe(markdown);
    });

    it('leaves other links alone', () => {
        const text = '[@olexh](https://example.com/olexh) [site](https://x.y)';
        expect(parseCommentMentions(text)).toEqual({ text, mentions: [] });
    });
});

describe('serializeCommentMentions', () => {
    const olexh = { username: 'olexh', reference: REF };

    it('links picked users and keeps other @words', () => {
        expect(
            serializeCommentMentions('@olexh and @someone', [olexh], SITE),
        ).toBe(`[@olexh](${SITE}/u/${REF}) and @someone`);
    });

    it('needs a standalone token', () => {
        expect(
            serializeCommentMentions(
                'mail@olexh @olexh2 x.com/@olexh',
                [olexh],
                SITE,
            ),
        ).toBe('mail@olexh @olexh2 x.com/@olexh');
    });

    it('links every occurrence, after punctuation and line starts', () => {
        expect(
            serializeCommentMentions('(@olexh)\n@olexh!', [olexh], SITE),
        ).toBe(`([@olexh](${SITE}/u/${REF}))\n[@olexh](${SITE}/u/${REF})!`);
    });

    it('round-trips with parseCommentMentions', () => {
        const markdown = `Hey [@olexh](${SITE}/u/${REF}) :spoiler[x]`;
        const { text, mentions } = parseCommentMentions(markdown);
        expect(serializeCommentMentions(text, mentions, SITE)).toBe(markdown);
    });

    it('does not touch text without picked users', () => {
        expect(serializeCommentMentions('@olexh', [], SITE)).toBe('@olexh');
    });
});

describe('commentThreadTitle', () => {
    const author = { username: 'olexh' } as CommentResponse['author'];

    it('names a comment by its author', () => {
        expect(commentThreadTitle({ author, review: null })).toBe(
            'Коментар @olexh',
        );
    });

    it('names a review as a review', () => {
        expect(
            commentThreadTitle({
                author,
                review: { recommended: 'yes', score: 8 },
            }),
        ).toBe('Відгук @olexh');
    });

    it('drops the mention without a username', () => {
        expect(
            commentThreadTitle({
                author: { ...author, username: null },
                review: null,
            }),
        ).toBe('Коментар');
    });
});

describe('commentExcerpt', () => {
    it('reads the markdown as plain text without spoilers', () => {
        expect(
            commentExcerpt(
                `**Жирний** [@olexh](${SITE}/u/${REF}) :spoiler[secret]`,
                200,
            ),
        ).toBe('Жирний @olexh [спойлер]');
    });

    it('truncates on a word boundary', () => {
        expect(commentExcerpt('one two three four', 10)).toBe('one two\u2026');
    });

    it('returns null for blank text', () => {
        expect(commentExcerpt(null, 150)).toBeNull();
        expect(commentExcerpt('\u200B', 150)).toBeNull();
    });
});
