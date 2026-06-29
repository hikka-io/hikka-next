import type { Descendant, Value } from 'platejs';

// Keep in sync with ELEMENT_IMAGE_PLACEHOLDER in
// components/plate/editor/plugins/image-placeholder-kit.tsx
const IMAGE_PLACEHOLDER = 'image_placeholder';

const walk = (nodes: Descendant[]): Descendant[] =>
    nodes
        .filter((node) => (node as any).type !== IMAGE_PLACEHOLDER)
        .map((node) =>
            'children' in node && Array.isArray(node.children)
                ? { ...node, children: walk(node.children) }
                : node,
        );

/**
 * Drop every transient `image_placeholder` node from a document so abandoned
 * (errored / in-flight) uploads are never persisted.
 */
export function stripUploadPlaceholders(value: Value): Value {
    return walk(value) as Value;
}
