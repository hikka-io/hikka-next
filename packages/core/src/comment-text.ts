import { marked } from 'marked';

import type { CommentResponse } from '@hikka/api';

import { isUserReference, userMentionPath, userUrlTarget } from './mentions';
import { BLANK_CHARS, truncateText } from './text';

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
        (
            match,
            username: string,
            url: string,
            offset: number,
            source: string,
        ) => {
            const target = userUrlTarget(url);
            // Glued to a word, a plain `@name` would not be re-linked on save: keep the link as typed.
            if (!target || /\w/.test(source[offset - 1] ?? '')) return match;

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

/** Page title of a comment thread: `Коментар @username`, or `Відгук @username` for a review. */
export function commentThreadTitle(
    comment: Pick<CommentResponse, 'author' | 'review'>,
): string {
    const kind = comment.review ? 'Відгук' : 'Коментар';
    return comment.author.username
        ? `${kind} @${comment.author.username}`
        : kind;
}

const SPOILER_PLACEHOLDER = '[спойлер]';
const SPOILER_BLOCK = /^(:{3,})spoiler\b[^\n]*\n[\s\S]*?^\1[ \t]*$/gm;
const SPOILER_INLINE_OPEN = ':spoiler[';
const WHITESPACE_RUN = /[\s\u200B\uFEFF]+/g;

function hideInlineSpoilers(text: string): string {
    let result = '';
    let index = 0;
    let start = text.indexOf(SPOILER_INLINE_OPEN);

    while (start !== -1) {
        let end = start + SPOILER_INLINE_OPEN.length;
        for (let depth = 1; end < text.length && depth > 0; end++) {
            if (text[end] === '[') depth++;
            else if (text[end] === ']') depth--;
        }
        result += text.slice(index, start) + SPOILER_PLACEHOLDER;
        index = end;
        start = text.indexOf(SPOILER_INLINE_OPEN, index);
    }

    return result + text.slice(index);
}

/**
 * Plain-text excerpt of comment markdown for link previews. Spoiler contents
 * never reach it: an unclosed inline spoiler hides the rest of the text.
 */
export function commentExcerpt(
    text: string | null | undefined,
    maxLength: number,
): string | null {
    if (!text) return null;

    const parts: string[] = [];
    const visible = hideInlineSpoilers(
        text.replace(SPOILER_BLOCK, SPOILER_PLACEHOLDER),
    );

    marked.walkTokens(marked.lexer(visible), (token) => {
        switch (token.type) {
            case 'text':
                if (!('tokens' in token && token.tokens)) parts.push(token.raw);
                break;
            case 'escape':
                parts.push(token.text);
                break;
            case 'codespan':
                parts.push(token.raw.replace(/^`+|`+$/g, ''));
                break;
            case 'paragraph':
            case 'heading':
            case 'list_item':
            case 'br':
                parts.push(' ');
                break;
        }
    });

    return truncateText(
        parts.join('').replace(WHITESPACE_RUN, ' ').trim(),
        maxLength,
        true,
    );
}
