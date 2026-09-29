import { ElementApi, type TElement, TextApi, type Value } from 'platejs';

/** True if a Plate Value contains any non-whitespace text content. */
export function hasPlateContent(value?: Value): boolean {
    if (!value || !Array.isArray(value) || value.length === 0) {
        return false;
    }

    const hasNonEmptyContent = (nodes: TElement[]): boolean => {
        for (const node of nodes) {
            if (ElementApi.isElement(node)) {
                if (
                    node.children &&
                    hasNonEmptyContent(node.children as TElement[])
                ) {
                    return true;
                }
            } else {
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
