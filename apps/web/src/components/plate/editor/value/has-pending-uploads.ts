import type { Descendant, Value } from 'platejs';

// Keep in sync with ELEMENT_IMAGE_PLACEHOLDER in
// components/plate/editor/plugins/image-placeholder-kit.tsx
const IMAGE_PLACEHOLDER = 'image_placeholder';

const walk = (nodes: Descendant[]): boolean =>
    nodes.some((node) => {
        if (
            (node as any).type === IMAGE_PLACEHOLDER &&
            (node as any).status === 'uploading'
        ) {
            return true;
        }
        return (
            'children' in node &&
            Array.isArray(node.children) &&
            walk(node.children)
        );
    });

/**
 * True when any `image_placeholder` is still uploading — used to block save
 * until in-flight uploads finish.
 */
export function hasPendingUploads(value: Value): boolean {
    return walk(value);
}
