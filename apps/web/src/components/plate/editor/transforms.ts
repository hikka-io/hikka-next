import { toggleList } from '@platejs/list-classic';
import {
    KEYS,
    type NodeEntry,
    type Path,
    PathApi,
    type TElement,
} from 'platejs';
import type { PlateEditor } from 'platejs/react';

// Containers need a paragraph child, not bare text
const CONTAINER_TYPES: Set<string> = new Set(['spoiler', KEYS.blockquote]);

// These use toggleList instead of insertNodes
const LIST_TYPES: Set<string> = new Set([KEYS.ulClassic, KEYS.olClassic]);

const createBlockNode = (editor: PlateEditor, type: string): TElement => {
    if (CONTAINER_TYPES.has(type)) {
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

    const isContainer = CONTAINER_TYPES.has(type);

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

        const block = editor.api.block();
        if (!block) return;

        const [node, path] = block;
        const newNode = createBlockNode(editor, type);

        let insertPath: Path;
        if (node.type === KEYS.p && editor.api.isEmpty(node)) {
            editor.tf.removeNodes({ at: path });
            insertPath = path;
        } else {
            insertPath = PathApi.next(path);
        }

        editor.tf.insertNodes(newNode, { at: insertPath, select: true });

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

const setBlockMap: Record<string, (editor: PlateEditor, type: string) => void> =
    {
        [KEYS.olClassic]: (editor) =>
            toggleList(editor, { type: editor.getType(KEYS.olClassic) }),
        [KEYS.taskList]: (editor) =>
            toggleList(editor, { type: editor.getType(KEYS.taskList) }),
        [KEYS.ulClassic]: (editor) =>
            toggleList(editor, { type: editor.getType(KEYS.ulClassic) }),
    };

export const setBlockType = (
    editor: PlateEditor,
    type: string,
    { at }: { at?: Path } = {},
) => {
    editor.tf.withoutNormalizing(() => {
        const setEntry = (entry: NodeEntry<TElement>) => {
            const [node, path] = entry;

            if (type in setBlockMap) {
                return setBlockMap[type](editor, type);
            }
            if (node.type !== type) {
                editor.tf.setNodes({ type }, { at: path });
            }
        };

        if (at) {
            const entry = editor.api.node<TElement>(at);

            if (entry) {
                setEntry(entry);

                return;
            }
        }

        const entries = editor.api.blocks({ mode: 'lowest' });

        entries.forEach((entry) => {
            setEntry(entry);
        });
    });
};

export const getBlockType = (block: TElement) => {
    return block.type;
};
