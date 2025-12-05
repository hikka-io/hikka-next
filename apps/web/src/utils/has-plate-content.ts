import { ElementApi, TElement, TextApi, Value } from 'platejs';

/**
 * Checks if a Plate Value (document) has actual content with non-empty text
 *
 * @param value The Plate Value to check
 * @returns true if the value contains any non-whitespace text content
 */
export function hasPlateContent(value?: Value): boolean {
    if (!value || !Array.isArray(value) || value.length === 0) {
        return false;
    }

    /**
     * Recursively checks if any node in the tree has non-empty text content
     */
    const hasNonEmptyContent = (nodes: TElement[]): boolean => {
        for (const node of nodes) {
            if (ElementApi.isElement(node)) {
                // If it's an element, recursively check its children
                if (
                    node.children &&
                    hasNonEmptyContent(node.children as TElement[])
                ) {
                    return true;
                }
            } else {
                // Check if it's a text node with non-empty content
                const textNode = node as { text?: string };
                if (
                    TextApi.isText(node) &&
                    textNode.text &&
                    textNode.text.trim() !== ''
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    return hasNonEmptyContent(value);
}
