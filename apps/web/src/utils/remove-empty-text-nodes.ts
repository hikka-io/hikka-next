import { ElementApi, TElement, TextApi } from 'platejs';

/**
 * Removes empty text nodes from the beginning and end of a Plate.js document
 * @param nodes The array of Plate/Slate nodes to process
 * @returns A new array with empty text nodes removed from beginning and end
 */
export default function removeEmptyTextNodes(nodes: TElement[]): TElement[] {
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        return nodes;
    }

    // Helper function to check if a node is an empty text node
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

    // Find the first non-empty node from the beginning
    let startIndex = 0;
    while (startIndex < nodes.length && isEmptyTextNode(nodes[startIndex])) {
        startIndex++;
    }

    // If all nodes are empty, return an empty array
    if (startIndex === nodes.length) {
        return [];
    }

    // Find the last non-empty node from the end
    let endIndex = nodes.length - 1;
    while (endIndex >= 0 && isEmptyTextNode(nodes[endIndex])) {
        endIndex--;
    }

    // Return the slice of nodes without empty text nodes at the beginning and end
    return nodes.slice(startIndex, endIndex + 1);
}

// Example usage:
// const plateEditor: PlateEditor<Value> = editor;
// const plateValue: Node[] = plateEditor.children;
// const cleanedNodes = removeEmptyTextNodesFromEnds(plateValue);
// const dataToSendToBackend = { nodes: cleanedNodes };
