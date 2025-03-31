import { SlateEditor, TElement, TText } from '@udecode/plate';
import {
    SerializeMdOptions,
    serializeMd as _serializeMd,
    serializeMdNodes,
} from '@udecode/plate-markdown';

interface LinkElement extends TElement {
    type: 'a';
    url: string;
    children: TText[];
}

// Helper to check if node is empty
const isNodeEmpty = (node: TElement) => {
    if (!node.children || node.children.length === 0) return true;

    return (node.children as Array<TElement | TText>).every((child) => {
        if ('type' in child) {
            // For links, check their content
            if (child.type === 'a') {
                const linkChild = child as LinkElement;
                return !linkChild.children?.[0]?.text?.trim();
            }
            // For other elements, check their children
            return (
                !child.children ||
                (child.children as Array<TText>).every((c) => !c.text?.trim())
            );
        }
        // For text nodes
        const textNode = child as TText;
        return !textNode.text?.trim();
    });
};

export function serializeMd({
    editor,
    options,
}: {
    editor: SlateEditor;
    options?: Parameters<typeof serializeMdNodes>['1'];
}) {
    // Check if editor is completely empty
    if (
        !editor.children ||
        editor.children.length === 0 ||
        (editor.children.length === 1 && isNodeEmpty(editor.children[0]))
    ) {
        return '';
    }

    return _serializeMd(editor, {
        ...options,
        breakTag: '',
        customNodes: {
            spoiler: {
                serialize: (children: string) =>
                    `:::spoiler\n${children}\n:::\n`,
                type: 'spoiler',
            },
            // Add custom link serialization
            a: {
                serialize: (
                    children: string,
                    node: any,
                    opts: SerializeMdOptions,
                ) => {
                    const linkNode = node as LinkElement;
                    const text = children.trim();
                    if (!text) return '';
                    return `[${text}](${linkNode.url})`;
                },
                type: 'a',
            },
        },
    });
}
