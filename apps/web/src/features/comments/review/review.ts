type TextishNode = {
    text?: unknown;
    children?: readonly TextishNode[];
    [key: string]: unknown;
};

export function getPlainTextLength(nodes: readonly TextishNode[]): number {
    let length = 0;
    for (const node of nodes) {
        if (typeof node.text === 'string') {
            length += node.text.length;
        } else if (node.children) {
            length += getPlainTextLength(node.children);
        }
    }
    return length;
}
