import { spoilerBlock, spoilerInline } from '@hikka/core';

export type Selection = { start: number; end: number };

export type Edit = { text: string; selection: Selection };

export type MentionQuery = { start: number; query: string };

const MENTION_BEFORE_CARET = /(^|[^\w@/[\]])@([A-Za-z0-9_]*)$/;

/** The `@name` being typed right before the caret, so the picker can complete it. */
export function activeMentionQuery(
    text: string,
    selection: Selection,
): MentionQuery | null {
    if (selection.start !== selection.end) return null;

    const match = MENTION_BEFORE_CARET.exec(text.slice(0, selection.start));
    if (!match) return null;

    return {
        start: selection.start - match[2].length - 1,
        query: match[2],
    };
}

const caret = (position: number): Selection => ({
    start: position,
    end: position,
});

/** Replaces the typed `@que` with `@username ` and puts the caret after it. */
export function insertMention(
    text: string,
    mention: MentionQuery,
    caretAt: number,
    username: string,
): Edit {
    const inserted = `@${username} `;
    const rest = text.slice(caretAt).replace(/^ /, '');

    return {
        text: `${text.slice(0, mention.start)}${inserted}${rest}`,
        selection: caret(mention.start + inserted.length),
    };
}

/** Starts a mention at the caret, with a space before it when it would glue to a word. */
export function startMention(text: string, selection: Selection): Edit {
    const before = text.slice(0, selection.start);
    const prefix = before === '' || /\s$/.test(before) ? '@' : ' @';
    const next = `${before}${prefix}${text.slice(selection.end)}`;

    return { text: next, selection: caret(before.length + prefix.length) };
}

/**
 * Wraps the selection in a spoiler: an inline `:spoiler[...]` for a short selection
 * on one line, a `:::spoiler` block otherwise (or around an empty caret, with the
 * caret inside). A block always sits on its own lines.
 */
export function insertSpoiler(text: string, selection: Selection): Edit {
    const { start, end } = selection;
    const selected = text.slice(start, end);
    const before = text.slice(0, start);
    const after = text.slice(end);

    if (selected && !/[\n\]]/.test(selected)) {
        // `a:` before `:spoiler[x]` would read as `a::spoiler[x]`, which never parses.
        const lead = before.endsWith(':') ? ' ' : '';
        const inline = `${lead}${spoilerInline(selected)}`;

        return {
            text: `${before}${inline}${after}`,
            selection: caret(start + inline.length),
        };
    }

    const lead = before === '' || before.endsWith('\n') ? '' : '\n';
    const trail = after === '' || after.startsWith('\n') ? '' : '\n';
    const block = spoilerBlock(selected);
    const next = `${before}${lead}${block}${trail}${after}`;
    const opening = `${lead}:::spoiler\n`;

    return {
        text: next,
        selection: selected
            ? caret(start + lead.length + block.length)
            : caret(start + opening.length),
    };
}

/** Where the caret belongs after `prev` became `next`: right after the inserted or replaced run. */
export function caretAfterChange(prev: string, next: string): number {
    let suffix = 0;
    const max = Math.min(prev.length, next.length);

    while (
        suffix < max &&
        prev[prev.length - 1 - suffix] === next[next.length - 1 - suffix]
    ) {
        suffix++;
    }

    let prefix = 0;
    while (prefix < max - suffix && prev[prefix] === next[prefix]) {
        prefix++;
    }

    return Math.max(prefix, next.length - suffix);
}
