import { describe, expect, it } from 'vitest';

import {
    patchEmbeddedFollow,
    patchEmbeddedStatus,
    patchEmbeddedVote,
} from './patch-embedded';

const USERNAME = 'target-user';

const author = (username: string, is_followed: boolean) => ({
    username,
    is_followed,
    avatar: `${username}.png`,
});

describe('patchEmbeddedStatus', () => {
    const anime = (slug: string, watch: object[]) => ({ slug, watch });
    const entry = { status: 'watching', episodes: 3 };

    it('replaces the status of the slug at every depth and keeps the rest', () => {
        const other = anime('other', []);
        const data = {
            list: [
                anime('frieren', []),
                { content: anime('frieren', []) },
                { anime: anime('frieren', []), character: { slug: 'x' } },
                other,
            ],
        };

        const patched = patchEmbeddedStatus(data, 'frieren', 'watch', entry);

        expect(patched.list[0]).toEqual(anime('frieren', [entry]));
        expect(patched.list[1]).toEqual({ content: anime('frieren', [entry]) });
        expect(patched.list[2]).toEqual({
            anime: anime('frieren', [entry]),
            character: { slug: 'x' },
        });
        expect(patched.list[3]).toBe(other);
        expect(data.list[0]).toEqual(anime('frieren', []));
    });

    it('clears the status when there is no next entry', () => {
        expect(
            patchEmbeddedStatus(
                anime('frieren', [entry]),
                'frieren',
                'watch',
                undefined,
            ),
        ).toEqual(anime('frieren', []));
    });

    it('leaves objects without the status field untouched', () => {
        const data = { list: [{ slug: 'frieren', read: [] }] };

        expect(patchEmbeddedStatus(data, 'frieren', 'watch', entry)).toBe(data);
    });
});

describe('patchEmbeddedFollow', () => {
    it('flips the target user at any depth and keeps the rest', () => {
        const other = author('other', false);
        const untouchedPage = { list: [{ reference: 'b', author: other }] };
        const data = {
            pages: [
                {
                    list: [
                        { reference: 'a', author: author(USERNAME, false) },
                        { reference: 'c', author: other },
                    ],
                },
                untouchedPage,
            ],
            pageParams: [1, 2],
        };

        const patched = patchEmbeddedFollow(data, {
            username: USERNAME,
            is_followed: true,
        });

        expect(patched.pages[0].list[0].author).toEqual(author(USERNAME, true));
        expect(patched.pages[0].list[1]).toBe(data.pages[0].list[1]);
        expect(patched.pages[1]).toBe(untouchedPage);
        expect(patched.pageParams).toBe(data.pageParams);
        expect(data.pages[0].list[0].author.is_followed).toBe(false);
    });

    it('patches a top-level user and the popular-authors shape', () => {
        expect(
            patchEmbeddedFollow(author(USERNAME, false), {
                username: USERNAME,
                is_followed: true,
            }),
        ).toEqual(author(USERNAME, true));
        expect(
            patchEmbeddedFollow(
                { authors: [{ user: author(USERNAME, true), accepted: 3 }] },
                { username: USERNAME, is_followed: false },
            ),
        ).toEqual({
            authors: [{ user: author(USERNAME, false), accepted: 3 }],
        });
    });

    it.each([
        ['another user', author('other', false)],
        ['an already matching state', author(USERNAME, true)],
        ['a user without is_followed', { username: USERNAME }],
    ])('returns the same object for %s', (_, user) => {
        const data = { list: [{ author: user }] };

        expect(
            patchEmbeddedFollow(data, {
                username: USERNAME,
                is_followed: true,
            }),
        ).toBe(data);
    });
});

describe('patchEmbeddedVote', () => {
    const comment = (
        reference: string,
        my_score: number,
        vote_score: number,
    ) => ({
        reference,
        my_score,
        vote_score,
    });

    it('moves the score by the change of my_score, also in nested replies', () => {
        const sibling = comment('sibling', 0, 2);
        const data = {
            list: [
                {
                    ...comment('parent', 0, 5),
                    replies: [comment('target', 1, 4), sibling],
                },
            ],
        };

        const patched = patchEmbeddedVote(data, 'target', -1);

        expect(patched.list[0].replies[0]).toEqual(comment('target', -1, 2));
        expect(patched.list[0]).toMatchObject(comment('parent', 0, 5));
        expect(patched.list[0].replies[1]).toBe(sibling);
    });

    it('returns the same object when nothing changes', () => {
        const data = {
            list: [comment('target', 1, 4), comment('other', 0, 1)],
        };

        expect(patchEmbeddedVote(data, 'target', 1)).toBe(data);
        expect(patchEmbeddedVote(data, 'missing', 1)).toBe(data);
    });
});
