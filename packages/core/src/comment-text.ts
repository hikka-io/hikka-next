import type { CommentResponse } from '@hikka/api';

import { isUserReference, userMentionPath, userUrlTarget } from './mentions';
import { BLANK_CHARS } from './text';

/** Replies to a comment this deep attach to its parent instead (backend nesting limit). */
export const MAX_COMMENT_DEPTH = 5;

/** The backend counts the comment limit in code points, not UTF-16 units. */
export const commentTextLength = (text: string) => Array.from(text).length;

/**
 * The text to send: trimmed, or empty when nothing but whitespace and zero-width
 * characters is left. The backend accepts a lone U+200B, so this is the only guard
 * against a blank comment.
 */
export function normalizeCommentText(text: string): string {
    return text.replace(BLANK_CHARS, '') === '' ? '' : text.trim();
}

/**
 * Written raw, never through an escaping stringifier: `@second\_user` would no longer
 * match the `@([a-zA-Z0-9_]+)` scan the backend runs to raise tag notifications.
 */
export const mentionMarkdown = (label: string, url: string) =>
    `[${label}](${url})`;

export type MentionUser = { username: string; reference: string };

/** `[@username](<site>/u/<reference>)`: the reference survives a rename. */
export const userMentionMarkdown = (
    siteOrigin: string,
    { username, reference }: MentionUser,
) =>
    mentionMarkdown(
        `@${username}`,
        `${siteOrigin}${userMentionPath(reference)}`,
    );

export const spoilerInline = (text: string) => `:spoiler[${text}]`;

export const spoilerBlock = (text: string) => `:::spoiler\n${text}\n:::`;

type ReplyTarget = Pick<
    CommentResponse,
    'reference' | 'parent' | 'depth' | 'author'
>;

/**
 * Where a reply lands: under the comment, or under its parent with an `@username`
 * prefix once the comment sits at the nesting limit.
 */
export function commentReplyTarget(comment: ReplyTarget): {
    parent: string;
    mention: string;
} {
    if (comment.depth < MAX_COMMENT_DEPTH || !comment.parent) {
        return { parent: comment.reference, mention: '' };
    }

    return {
        parent: comment.parent,
        mention: comment.author.username ? `@${comment.author.username} ` : '',
    };
}

const MENTION_LINK = /\[@([A-Za-z0-9_]+)\]\(([^)\s]+)\)/g;
const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Turns stored comment markdown into composer text: every mention link becomes the
 * plain `@username` the user sees, and the picked users are returned alongside.
 */
export function parseCommentMentions(markdown: string): {
    text: string;
    mentions: MentionUser[];
} {
    const mentions: MentionUser[] = [];

    const text = markdown.replace(
        MENTION_LINK,
        (match, username: string, url: string) => {
            const target = userUrlTarget(url);
            if (!target) return match;

            if (!mentions.some((mention) => mention.username === username)) {
                mentions.push({
                    username,
                    reference: isUserReference(target) ? target : username,
                });
            }
            return `@${username}`;
        },
    );

    return { text, mentions };
}

/**
 * The inverse of `parseCommentMentions`: every standalone `@username` of a picked
 * user becomes its mention link; any other `@word` stays as typed.
 */
export function serializeCommentMentions(
    text: string,
    mentions: readonly MentionUser[],
    siteOrigin: string,
): string {
    if (mentions.length === 0) return text;

    const byName = new Map(
        mentions.map((mention) => [mention.username.toLowerCase(), mention]),
    );
    const names = mentions.map((mention) => escapeRegExp(mention.username));
    const pattern = new RegExp(
        `(^|[^\\w[@/])@(${names.join('|')})(?![\\w\\]])`,
        'gi',
    );

    return text.replace(pattern, (match, before: string, name: string) => {
        const mention = byName.get(name.toLowerCase());
        return mention
            ? `${before}${userMentionMarkdown(siteOrigin, mention)}`
            : match;
    });
}
