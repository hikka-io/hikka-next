import { ElementApi, type TElement, TextApi } from 'platejs';

/** Trims empty text nodes from the start and end of a Plate.js document. */
export function removeEmptyTextNodes(nodes: TElement[]): TElement[] {
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        return nodes;
    }

    const isEmptyTextNode = (node: TElement): boolean => {
        return (
            ElementApi.isElement(node) &&
            node.type === 'p' &&
            node.children &&
            node.children.length === 1 &&
            TextApi.isText(node.children[0]) &&
            node.children[0].text.trim() === ''
        );
    };

    let startIndex = 0;
    while (startIndex < nodes.length && isEmptyTextNode(nodes[startIndex])) {
        startIndex++;
    }

    if (startIndex === nodes.length) {
        return [];
    }

    let endIndex = nodes.length - 1;
    while (endIndex >= 0 && isEmptyTextNode(nodes[endIndex])) {
        endIndex--;
    }

    return nodes.slice(startIndex, endIndex + 1);
}
