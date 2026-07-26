import { describe, expect, it } from 'vitest';

import type { CommentResponse } from '@hikka/api';

import {
    buildCommentTree,
    type CommentNode,
    countCommentNodes,
    flattenCommentNodes,
} from './build-comment-tree';

function comment(
    reference: string,
    parent: string | null = null,
): CommentResponse {
    return {
        reference,
        parent,
        depth: 1,
        text: reference,
        replies: [],
        total_replies: 0,
    } as unknown as CommentResponse;
}

const refs = (nodes: CommentNode[]) => nodes.map((node) => node.reference);

describe('buildCommentTree', () => {
    it('nests replies under their parent', () => {
        const tree = buildCommentTree([
            comment('a'),
            comment('a1', 'a'),
            comment('a1a', 'a1'),
            comment('b'),
        ]);

        expect(refs(tree)).toEqual(['a', 'b']);
        expect(refs(tree[0].children)).toEqual(['a1']);
        expect(refs(tree[0].children[0].children)).toEqual(['a1a']);
        expect(tree[1].children).toEqual([]);
    });

    it('keeps the order the API returned', () => {
        const tree = buildCommentTree([
            comment('b'),
            comment('a'),
            comment('b2', 'b'),
            comment('b1', 'b'),
        ]);

        expect(refs(tree)).toEqual(['b', 'a']);
        expect(refs(tree[0].children)).toEqual(['b2', 'b1']);
    });

    it('promotes replies whose parent is missing from the slice', () => {
        // Shape of /comments/thread/{reference} for a nested comment.
        const tree = buildCommentTree([
            comment('a1', 'a'),
            comment('a1a', 'a1'),
        ]);

        expect(refs(tree)).toEqual(['a1']);
        expect(refs(tree[0].children)).toEqual(['a1a']);
    });

    it('keeps one copy when infinite pages repeat a comment', () => {
        const tree = buildCommentTree([
            comment('a'),
            comment('a1', 'a'),
            comment('a1', 'a'),
        ]);

        expect(refs(tree)).toEqual(['a']);
        expect(refs(tree[0].children)).toEqual(['a1']);
    });

    it('does not loop on a comment that parents itself', () => {
        const tree = buildCommentTree([comment('a', 'a')]);

        expect(refs(tree)).toEqual(['a']);
        expect(tree[0].children).toEqual([]);
    });

    it('returns no roots for an empty response', () => {
        expect(buildCommentTree([])).toEqual([]);
    });
});

describe('flattenCommentNodes', () => {
    it('round-trips through buildCommentTree', () => {
        const rows = [
            comment('a'),
            comment('a1', 'a'),
            comment('a1a', 'a1'),
            comment('b'),
        ];
        const flat = flattenCommentNodes(buildCommentTree(rows));

        expect(flat.map((row) => row.reference)).toEqual([
            'a',
            'a1',
            'a1a',
            'b',
        ]);
    });

    it('unions already-loaded rows with fresher thread rows', () => {
        const loaded = buildCommentTree([comment('r1', 'root')]);
        const threadRows = [
            { ...comment('r1', 'root'), text: 'edited' },
            comment('r1a', 'r1'),
        ];

        const tree = buildCommentTree([
            ...flattenCommentNodes(loaded),
            ...threadRows,
        ]);

        expect(refs(tree)).toEqual(['r1']);
        expect(tree[0].text).toBe('edited');
        expect(refs(tree[0].children)).toEqual(['r1a']);
    });
});

describe('countCommentNodes', () => {
    it('counts nested replies, not just direct ones', () => {
        const tree = buildCommentTree([
            comment('a'),
            comment('a1', 'a'),
            comment('a1a', 'a1'),
            comment('a2', 'a'),
        ]);

        expect(countCommentNodes(tree[0].children)).toBe(3);
    });

    it('is zero without replies', () => {
        expect(countCommentNodes([])).toBe(0);
    });
});
