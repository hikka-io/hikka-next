import { type CommentNode, countCommentNodes } from '@hikka/core';

/**
 * Thread guides of one row, by indentation level: `guides[k]` draws the vertical
 * line of the ancestor at level `k` through the row (more of its replies follow);
 * the row's own level always gets the elbow, continued below when `hasNext`.
 */
type Guides = {
    depth: number;
    guides: boolean[];
    hasNext: boolean;
};

export type CommentRow =
    | (Guides & {
          type: 'comment';
          key: string;
          node: CommentNode;
          expanded: boolean;
          /** Replies loaded under this comment (descendants, not only children). */
          loadedReplies: number;
          /** Replies the backend has that the loaded rows do not show. */
          missingReplies: number;
          /** Its own line runs down to the replies drawn below it. */
          threadLine: boolean;
      })
    | (Guides & {
          type: 'more';
          key: string;
          node: CommentNode;
      });

type Options = {
    isExpanded: (node: CommentNode, depth: number) => boolean;
    /** List screens link out to the thread for replies the list response leaves out. */
    showMissing: boolean;
};

/** Relative depth 0 starts expanded, like the web's `depth < 2` for roots. */
export const defaultExpanded = (depth: number) => depth === 0;

/** Flattens a reply tree into FlashList rows, depth-first, honouring collapsed comments. */
export function flattenCommentRows(
    roots: CommentNode[],
    { isExpanded, showMissing }: Options,
): CommentRow[] {
    const rows: CommentRow[] = [];

    const visit = (
        nodes: CommentNode[],
        depth: number,
        guides: boolean[],
        trailing: boolean,
    ) => {
        nodes.forEach((node, index) => {
            const hasNext = index < nodes.length - 1 || trailing;
            const loadedReplies = countCommentNodes(node.children);
            const missingReplies = Math.max(
                (node.total_replies ?? 0) - loadedReplies,
                0,
            );
            const expanded =
                node.children.length > 0 && isExpanded(node, depth);
            const more = showMissing && expanded && missingReplies > 0;

            rows.push({
                type: 'comment',
                key: node.reference,
                node,
                depth,
                guides,
                hasNext,
                expanded,
                loadedReplies,
                missingReplies,
                threadLine: expanded,
            });

            if (!expanded) return;

            const childGuides = depth === 0 ? [] : [...guides, hasNext];
            visit(node.children, depth + 1, childGuides, more);

            if (more) {
                rows.push({
                    type: 'more',
                    key: `${node.reference}:more`,
                    node,
                    depth: depth + 1,
                    guides: childGuides,
                    hasNext: false,
                });
            }
        });
    };

    visit(roots, 0, [], false);

    return rows;
}
