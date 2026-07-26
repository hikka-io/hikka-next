import type { PendingReply } from '@/services/providers/comments-provider';

import { type CommentNode, toCommentNode } from './build-comment-tree';

/**
 * Pins replies posted in this session to the top of `serverReplies` — or after
 * `insertAfter`, for replies re-parented at max depth — so they do not jump to
 * their sorted position on the next refetch. Pending entries decide placement
 * only: once the server returns a reply, its copy wins on content and replies.
 */
export function mergePendingReplies(
    serverReplies: CommentNode[],
    pendingReplies: PendingReply[],
    reference: string,
): CommentNode[] {
    if (pendingReplies.length === 0) return serverReplies;

    const relevant = pendingReplies.filter(
        (pending) => pending.comment.parent === reference,
    );
    if (relevant.length === 0) return serverReplies;

    const serverByReference = new Map(
        serverReplies.map((reply) => [reply.reference, reply]),
    );
    const resolve = (pending: PendingReply) =>
        serverByReference.get(pending.comment.reference) ??
        toCommentNode(pending.comment);

    const pinned = relevant.filter((pending) => !pending.insertAfter);
    const appended = relevant.filter((pending) => pending.insertAfter);

    const pinnedReferences = new Set(
        relevant.map((pending) => pending.comment.reference),
    );
    const rest = serverReplies.filter(
        (reply) => !pinnedReferences.has(reply.reference),
    );

    const appendedByTarget = new Map<string, CommentNode[]>();
    for (const pending of appended) {
        const target = pending.insertAfter;
        if (!target) continue;
        appendedByTarget.set(target, [
            ...(appendedByTarget.get(target) ?? []),
            resolve(pending),
        ]);
    }

    const merged = [...pinned.map(resolve), ...rest];
    if (appendedByTarget.size === 0) return merged;

    const mergedReferences = new Set(merged.map((reply) => reply.reference));
    const placed = merged.flatMap((reply) => {
        const after = appendedByTarget.get(reply.reference);
        return after ? [reply, ...after] : [reply];
    });

    // Target gone (deleted, or outside the loaded slice) — append rather than
    // drop the reply along with it.
    const orphaned = appended
        .filter(
            (pending) =>
                pending.insertAfter &&
                !mergedReferences.has(pending.insertAfter),
        )
        .map(resolve);

    return orphaned.length === 0 ? placed : [...placed, ...orphaned];
}
