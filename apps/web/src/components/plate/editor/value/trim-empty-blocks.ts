import { ElementApi, NodeApi, type TElement, TextApi } from 'platejs';

const CONTAINER_TYPES: Set<string> = new Set(['blockquote', 'spoiler']);

// U+200B and U+FEFF survive String.trim(), and the markdown serializer writes
// U+200B for every blank paragraph.
const BLANK_CHARS = /[\s​﻿]/g;

const isBlankBlock = (node: TElement): boolean => {
    if (!ElementApi.isElement(node)) return false;

    if (CONTAINER_TYPES.has(node.type)) {
        return node.children.every((child) => isBlankBlock(child as TElement));
    }

    if (node.type !== 'p') return false;

    // Media and inline elements hold empty text of their own — a paragraph is
    // only blank when nothing but text is in it.
    return (
        node.children.every((child) => TextApi.isText(child)) &&
        NodeApi.string(node).replace(BLANK_CHARS, '') === ''
    );
};

/** Trims blank blocks from the start and end of a Plate document. */
export function trimEmptyBlocks(nodes: TElement[]): TElement[] {
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        return nodes;
    }

    let start = 0;
    while (start < nodes.length && isBlankBlock(nodes[start])) {
        start++;
    }

    if (start === nodes.length) {
        return [];
    }

    let end = nodes.length - 1;
    while (end >= 0 && isBlankBlock(nodes[end])) {
        end--;
    }

    return nodes.slice(start, end + 1);
}
