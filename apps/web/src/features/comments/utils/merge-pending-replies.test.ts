import { describe, expect, it } from 'vitest';

import type { CommentResponse } from '@hikka/api';

import type { PendingReply } from '@/services/providers/comments-provider';

import { buildCommentTree } from './build-comment-tree';
import { mergePendingReplies } from './merge-pending-replies';

function comment(
    reference: string,
    parent: string | null = null,
    extra: Partial<CommentResponse> = {},
): CommentResponse {
    return {
        reference,
        parent,
        depth: 1,
        text: reference,
        replies: [],
        total_replies: 0,
        ...extra,
    } as unknown as CommentResponse;
}

const pending = (
    reference: string,
    parent: string,
    insertAfter?: string,
): PendingReply => ({ comment: comment(reference, parent), insertAfter });

const refs = (nodes: { reference: string }[]) =>
    nodes.map((node) => node.reference);

describe('mergePendingReplies', () => {
    it('returns the server replies untouched when nothing is pending', () => {
        const replies = buildCommentTree([comment('a1', 'a')]);

        expect(mergePendingReplies(replies, [], 'a')).toBe(replies);
    });

    it('ignores replies pending under a different comment', () => {
        const replies = buildCommentTree([comment('a1', 'a')]);

        expect(mergePendingReplies(replies, [pending('b1', 'b')], 'a')).toBe(
            replies,
        );
    });

    it('pins a new reply above the server ones', () => {
        const replies = buildCommentTree([
            comment('a1', 'a'),
            comment('a2', 'a'),
        ]);

        const merged = mergePendingReplies(replies, [pending('new', 'a')], 'a');

        expect(refs(merged)).toEqual(['new', 'a1', 'a2']);
    });

    it('keeps a pinned reply in place once the server returns it', () => {
        const replies = buildCommentTree([
            comment('a1', 'a'),
            comment('new', 'a'),
        ]);

        const merged = mergePendingReplies(replies, [pending('new', 'a')], 'a');

        expect(refs(merged)).toEqual(['new', 'a1']);
    });

    it('prefers the server copy of a pinned reply, keeping its own replies', () => {
        // Server picked the reply up, and someone answered it.
        const replies = buildCommentTree([
            comment('new', 'a', { text: 'edited', vote_score: 3 }),
            comment('new1', 'new'),
        ]);

        const merged = mergePendingReplies(replies, [pending('new', 'a')], 'a');

        expect(refs(merged)).toEqual(['new']);
        expect(merged[0].text).toBe('edited');
        expect(merged[0].vote_score).toBe(3);
        expect(refs(merged[0].children)).toEqual(['new1']);
    });

    it('places a max-depth reply after the comment it answers', () => {
        const replies = buildCommentTree([
            comment('p1', 'p'),
            comment('p2', 'p'),
        ]);

        const merged = mergePendingReplies(
            replies,
            [pending('new', 'p', 'p1')],
            'p',
        );

        expect(refs(merged)).toEqual(['p1', 'new', 'p2']);
    });

    it('does not duplicate a max-depth reply the server already returned', () => {
        const replies = buildCommentTree([
            comment('p1', 'p'),
            comment('new', 'p'),
            comment('p2', 'p'),
        ]);

        const merged = mergePendingReplies(
            replies,
            [pending('new', 'p', 'p1')],
            'p',
        );

        expect(refs(merged)).toEqual(['p1', 'new', 'p2']);
    });

    it('appends a reply whose insertAfter target is gone', () => {
        // Target deleted; the reply the server returned must not vanish too.
        const replies = buildCommentTree([
            comment('p1', 'p'),
            comment('new', 'p'),
        ]);

        const merged = mergePendingReplies(
            replies,
            [pending('new', 'p', 'gone')],
            'p',
        );

        expect(refs(merged)).toEqual(['p1', 'new']);
    });

    it('appends an unsent orphaned reply after the server ones', () => {
        const replies = buildCommentTree([comment('p1', 'p')]);

        const merged = mergePendingReplies(
            replies,
            [pending('new', 'p', 'gone')],
            'p',
        );

        expect(refs(merged)).toEqual(['p1', 'new']);
    });

    it('keeps several pending replies to the same comment', () => {
        const replies = buildCommentTree([comment('a1', 'a')]);

        const merged = mergePendingReplies(
            replies,
            [pending('new1', 'a'), pending('new2', 'a')],
            'a',
        );

        expect(refs(merged)).toEqual(['new1', 'new2', 'a1']);
    });
});
