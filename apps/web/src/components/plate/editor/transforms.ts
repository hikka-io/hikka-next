import { createLinkNode } from '@platejs/link';
import { toggleList } from '@platejs/list-classic';
import { BlockSelectionPlugin } from '@platejs/selection/react';
import {
    type Descendant,
    ElementApi,
    KEYS,
    NodeApi,
    type Path,
    PathApi,
    type TElement,
} from 'platejs';
import type { PlateEditor } from 'platejs/react';

import type { ContentTypeEnum, UserResponse } from '@hikka/api';

import { contentPath } from '@/utils/content-paths';
import { userMentionUrl } from '@/utils/mentions';
import { getSiteUrl } from '@/utils/url';

import { CONTAINER_BLOCK_TYPES } from './plate-types';

// These use toggleList instead of insertNodes
const LIST_TYPES: Set<string> = new Set([KEYS.ulClassic, KEYS.olClassic]);

const HEADING_TYPES: ReadonlySet<string> = new Set([KEYS.h3, KEYS.h4, KEYS.h5]);

const TEXT_BLOCK_TYPES: ReadonlySet<string> = new Set([
    KEYS.p,
    ...HEADING_TYPES,
]);

const TURN_INTO_TYPES: ReadonlySet<string> = new Set([
    ...TEXT_BLOCK_TYPES,
    ...LIST_TYPES,
    ...CONTAINER_BLOCK_TYPES,
]);

const createBlockNode = (editor: PlateEditor, type: string): TElement => {
    // Containers need a paragraph child, not bare text
    if (CONTAINER_BLOCK_TYPES.has(type)) {
        return {
            type,
            children: [{ type: KEYS.p, children: [{ text: '' }] } as TElement],
        };
    }

    return editor.api.create.block({ type });
};

export const isInsideBlock = (editor: PlateEditor, type: string): boolean => {
    return editor.api.some({ match: { type } });
};

/**
 * Put the caret back where it was before the toolbar took focus. Tapping a
 * toolbar button on touch devices blurs the editor, and Slate deselects on
 * blur — without this every insert lands at the end of the document.
 */
export const restoreSelection = (editor: PlateEditor) => {
    if (editor.selection) return;

    const previous = editor.dom.prevSelection;

    if (
        previous &&
        editor.api.hasPath(previous.anchor.path) &&
        editor.api.hasPath(previous.focus.path)
    ) {
        editor.tf.select(previous);
        return;
    }

    const end = editor.api.end([]);
    if (end) {
        editor.tf.select(end);
    }
};

// Matching only top-level blocks keeps multi-block structures (lists,
// blockquotes) intact instead of wrapping their inner blocks.
const wrapBlock = (editor: PlateEditor, type: string) => {
    editor.tf.wrapNodes<TElement>(
        { type, children: [] },
        {
            at: editor.selection ?? undefined,
            match: (_, path) => path.length === 1,
        },
    );
};

/**
 * Put a block where the caret is: in place of an empty paragraph, otherwise
 * after the current block (never splitting it); with no selection, at the end.
 * `highest` places it at the top level, for blocks the document only allows
 * there. Returns its path.
 */
export const insertBlockAtSelection = (
    editor: PlateEditor,
    node: TElement,
    { highest = false }: { highest?: boolean } = {},
): Path => {
    restoreSelection(editor);

    const lowest = editor.api.block();
    // A void inside a container (an image in its group) only accepts its own kind as a sibling.
    const nestedVoid =
        !!lowest && lowest[1].length > 1 && editor.api.isVoid(lowest[0]);
    const block = editor.api.block({ highest: highest || nestedVoid });
    const replace =
        !!block && block[0].type === KEYS.p && editor.api.isEmpty(block[0]);
    let at: Path = [editor.children.length];
    if (block) at = replace ? block[1] : PathApi.next(block[1]);

    editor.tf.withoutNormalizing(() => {
        if (replace) editor.tf.removeNodes({ at });
        editor.tf.insertNodes(node, { at, select: true });
    });

    return at;
};

/**
 * Insert a new block.
 * - Containers with a text selection: wraps the selected blocks
 * - On an empty paragraph: replaces it
 * - On a non-empty block: inserts after
 * - Lists: uses toggleList (converts current block to list)
 * - Prevents nesting containers of the same type
 */
export const insertBlock = (editor: PlateEditor, type: string) => {
    restoreSelection(editor);
    if (!editor.selection) return;

    const isContainer = CONTAINER_BLOCK_TYPES.has(type);

    // Prevent nesting containers of the same type (e.g. spoiler inside spoiler)
    if (isContainer && isInsideBlock(editor, type)) {
        return;
    }

    editor.tf.withoutNormalizing(() => {
        if (LIST_TYPES.has(type)) {
            toggleList(editor, { type: editor.getType(type) as 'ul' | 'ol' });
            return;
        }

        if (isContainer && editor.api.isExpanded()) {
            wrapBlock(editor, type);
            return;
        }

        const insertPath = insertBlockAtSelection(
            editor,
            createBlockNode(editor, type),
        );

        // Trailing paragraph so the user can keep typing after the container
        if (isContainer) {
            editor.tf.insertNodes(
                {
                    type: KEYS.p,
                    children: [{ text: '' }],
                } as TElement,
                { at: PathApi.next(insertPath) },
            );
        }
    });
};

/**
 * Wrap the selection in a container, or unwrap it when the selection already
 * touches one. With a collapsed selection outside a container this inserts an
 * empty one, matching the toolbar's "insert" semantics.
 */
export const toggleContainerBlock = (editor: PlateEditor, type: string) => {
    restoreSelection(editor);
    if (!editor.selection) return;

    if (isInsideBlock(editor, type)) {
        editor.tf.unwrapNodes({ at: editor.selection, match: { type } });
        return;
    }

    insertBlock(editor, type);
};

const isWithinSingleBlock = (editor: PlateEditor) =>
    editor.api.blocks({ mode: 'lowest' }).length === 1;

export const toggleInlineNode = (editor: PlateEditor, type: string) => {
    if (isInsideBlock(editor, type)) {
        editor.tf.unwrapNodes({
            at: editor.selection ?? undefined,
            match: { type },
            split: true,
        });
        return;
    }

    if (!editor.api.isExpanded()) return;

    editor.tf.wrapNodes<TElement>(
        { type, children: [] },
        { at: editor.selection ?? undefined, split: true },
    );
};

/**
 * The spoiler button and its shortcut pick a form from the selection: text
 * selected inside one block becomes an inline spoiler, anything else the
 * block container.
 */
export const toggleSpoiler = (
    editor: PlateEditor,
    { block, inline }: { block: string; inline: string },
) => {
    restoreSelection(editor);
    if (!editor.selection) return;

    const hasInline = !!editor.plugins[inline];

    if (
        hasInline &&
        (isInsideBlock(editor, inline) ||
            (editor.api.isExpanded() && isWithinSingleBlock(editor)))
    ) {
        toggleInlineNode(editor, inline);
        return;
    }

    toggleContainerBlock(editor, block);
};

export const insertContentLink = (
    editor: PlateEditor,
    { type, slug, text }: { type: ContentTypeEnum; slug: string; text: string },
) => {
    editor.tf.insertNodes(
        createLinkNode(editor, {
            url: `${getSiteUrl()}${contentPath(type, slug)}`,
            text,
        }),
    );
};

export const insertMentionLink = (
    editor: PlateEditor,
    { reference, username }: Pick<UserResponse, 'reference' | 'username'>,
) => {
    editor.tf.insertNodes(
        createLinkNode(editor, {
            url: userMentionUrl(reference),
            text: `@${username}`,
        }),
    );
};

const containsType = (element: TElement, type: string) =>
    [...NodeApi.descendants(element)].some(
        ([node]) => ElementApi.isElement(node) && node.type === type,
    );

/** Whether the block menu can turn a top-level block into `type`; containers only swap or unwrap. */
export const canTurnInto = (element: TElement, type: string) => {
    if (!TURN_INTO_TYPES.has(type)) return false;

    if (CONTAINER_BLOCK_TYPES.has(element.type)) {
        return (
            type === KEYS.p ||
            (CONTAINER_BLOCK_TYPES.has(type) && !containsType(element, type))
        );
    }

    return TEXT_BLOCK_TYPES.has(element.type) || LIST_TYPES.has(element.type);
};

const listLines = (list: TElement) =>
    [...NodeApi.descendants(list)]
        .map(([node]) => node)
        .filter(
            (node): node is TElement =>
                ElementApi.isElement(node) && node.type === KEYS.lic,
        )
        .map((lic) => lic.children);

// The backend allows a heading one plain text node, so a heading keeps only the text.
const createLineBlock = (type: string, children: Descendant[]): TElement =>
    HEADING_TYPES.has(type)
        ? { type, children: [{ text: NodeApi.string({ type, children }) }] }
        : { type: KEYS.p, children };

const createTurnedBlocks = (type: string, lines: Descendant[][]) => {
    if (LIST_TYPES.has(type)) {
        return [
            {
                type,
                children: lines.map((children) => ({
                    type: KEYS.li,
                    children: [{ type: KEYS.lic, children }],
                })),
            },
        ];
    }

    if (CONTAINER_BLOCK_TYPES.has(type)) {
        return [
            {
                type,
                children: lines.map((line) => createLineBlock(KEYS.p, line)),
            },
        ];
    }

    return lines.map((line) => createLineBlock(type, line));
};

/** Turns the top-level block at `path` into `type`, keeping its text; a list turns item by item. */
export const turnBlockInto = (
    editor: PlateEditor,
    path: Path,
    type: string,
) => {
    const element = editor.api.node<TElement>(path)?.[0];
    if (!element || element.type === type || !canTurnInto(element, type)) {
        return;
    }

    editor.tf.withoutNormalizing(() => {
        if (CONTAINER_BLOCK_TYPES.has(element.type)) {
            if (type === KEYS.p) editor.tf.unwrapNodes({ at: path });
            else editor.tf.setNodes({ type }, { at: path });
            return;
        }

        if (LIST_TYPES.has(element.type) && LIST_TYPES.has(type)) {
            editor.tf.setNodes({ type }, { at: path });
            return;
        }

        const lines = LIST_TYPES.has(element.type)
            ? listLines(element)
            : [element.children];

        editor.tf.removeNodes({ at: path });
        editor.tf.insertNodes(createTurnedBlocks(type, lines) as TElement[], {
            at: path,
        });
    });
};

/** Lets go of selected blocks, so focus can move into the text again. */
export const deselectBlocks = (editor: PlateEditor) => {
    if (editor.plugins[KEYS.blockSelection]) {
        editor.getApi(BlockSelectionPlugin).blockSelection.deselect();
    }
};
