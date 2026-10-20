import type { CommentResponse } from '@hikka/api';

export type CommentNode = CommentResponse & { children: CommentNode[] };

export function toCommentNode(comment: CommentResponse): CommentNode {
    return { ...comment, children: [] };
}

/** Every reply under `nodes`, nested ones included. */
export function countCommentNodes(nodes: CommentNode[]): number {
    return nodes.reduce(
        (acc, node) => acc + 1 + countCommentNodes(node.children),
        0,
    );
}

/** Inverse of `buildCommentTree`, for rebuilding over a union of rows. */
export function flattenCommentNodes(nodes: CommentNode[]): CommentResponse[] {
    return nodes.flatMap((node) => [
        node,
        ...flattenCommentNodes(node.children),
    ]);
}

/**
 * Rebuild the reply tree from a `flat=true` response, preserving API order. A
 * comment whose parent is missing from the rows becomes a root instead of being
 * dropped — the normal shape of a thread response for a nested comment.
 */
export function buildCommentTree(comments: CommentResponse[]): CommentNode[] {
    const nodes = new Map<string, CommentNode>();

    // Infinite pages can repeat a comment; the last copy is the freshest.
    for (const comment of comments) {
        nodes.set(comment.reference, toCommentNode(comment));
    }

    const roots: CommentNode[] = [];

    for (const node of nodes.values()) {
        const parent = node.parent ? nodes.get(node.parent) : undefined;

        if (parent && parent !== node) {
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots;
}
