import { describe, expect, it } from 'vitest';

import type { CommentResponse } from '@hikka/api';
import { buildCommentTree } from '@hikka/core';

import {
    type CommentRow,
    defaultExpanded,
    flattenCommentRows,
} from './comment-rows';

const comment = (
    reference: string,
    parent: string | null = null,
    total_replies = 0,
) =>
    ({
        reference,
        parent,
        depth: 1,
        total_replies,
    }) as unknown as CommentResponse;

const expandAll = { isExpanded: () => true, showMissing: true };

const summary = (rows: CommentRow[]) =>
    rows.map((row) => ({
        key: row.key,
        depth: row.depth,
        guides: row.guides,
        hasNext: row.hasNext,
    }));

describe('flattenCommentRows', () => {
    it('lists the tree depth-first with its depth', () => {
        const tree = buildCommentTree([
            comment('a', null, 2),
            comment('a1', 'a', 1),
            comment('a1a', 'a1'),
            comment('b'),
        ]);

        expect(
            flattenCommentRows(tree, expandAll).map((row) => [
                row.key,
                row.depth,
            ]),
        ).toEqual([
            ['a', 0],
            ['a1', 1],
            ['a1a', 2],
            ['b', 0],
        ]);
    });

    it('carries an ancestor line through rows while its replies continue', () => {
        const tree = buildCommentTree([
            comment('a', null, 4),
            comment('a1', 'a', 1),
            comment('a1a', 'a1'),
            comment('a2', 'a', 1),
            comment('a2a', 'a2'),
        ]);

        expect(summary(flattenCommentRows(tree, expandAll))).toEqual([
            { key: 'a', depth: 0, guides: [], hasNext: false },
            { key: 'a1', depth: 1, guides: [], hasNext: true },
            { key: 'a1a', depth: 2, guides: [true], hasNext: false },
            { key: 'a2', depth: 1, guides: [], hasNext: false },
            { key: 'a2a', depth: 2, guides: [false], hasNext: false },
        ]);
    });

    it('hides the replies of a collapsed comment and counts them', () => {
        const tree = buildCommentTree([
            comment('a', null, 2),
            comment('a1', 'a', 1),
            comment('a1a', 'a1'),
        ]);

        const rows = flattenCommentRows(tree, {
            isExpanded: (_node, depth) => defaultExpanded(depth),
            showMissing: true,
        });

        expect(rows.map((row) => row.key)).toEqual(['a', 'a1']);
        expect(rows[0]).toMatchObject({
            expanded: true,
            threadLine: true,
            loadedReplies: 2,
        });
        expect(rows[1]).toMatchObject({
            expanded: false,
            threadLine: false,
            loadedReplies: 1,
        });
    });

    it('adds a link-out row after the loaded replies when the list left some out', () => {
        const tree = buildCommentTree([
            comment('a', null, 5),
            comment('a1', 'a'),
        ]);

        const rows = flattenCommentRows(tree, expandAll);

        expect(summary(rows)).toEqual([
            { key: 'a', depth: 0, guides: [], hasNext: false },
            { key: 'a1', depth: 1, guides: [], hasNext: true },
            { key: 'a:more', depth: 1, guides: [], hasNext: false },
        ]);
        expect(rows[0]).toMatchObject({ missingReplies: 4 });
    });

    it('leaves the link-out row out where the thread pages in everything', () => {
        const tree = buildCommentTree([
            comment('a', null, 5),
            comment('a1', 'a'),
        ]);

        const rows = flattenCommentRows(tree, {
            ...expandAll,
            showMissing: false,
        });

        expect(rows.map((row) => row.key)).toEqual(['a', 'a1']);
        expect(rows[1]).toMatchObject({ hasNext: false });
    });

    it('never expands a comment without loaded replies', () => {
        const rows = flattenCommentRows(
            buildCommentTree([comment('a', null, 3)]),
            expandAll,
        );

        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            expanded: false,
            threadLine: false,
            missingReplies: 3,
        });
    });
});
