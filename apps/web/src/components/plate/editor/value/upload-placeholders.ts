import type { Descendant, Value } from 'platejs';

import { ELEMENT_IMAGE_PLACEHOLDER } from '../plate-types';

const withoutPlaceholders = (nodes: Descendant[]): Descendant[] =>
    nodes
        .filter((node) => (node as any).type !== ELEMENT_IMAGE_PLACEHOLDER)
        .map((node) =>
            'children' in node && Array.isArray(node.children)
                ? { ...node, children: withoutPlaceholders(node.children) }
                : node,
        );

const hasUploadingPlaceholder = (nodes: Descendant[]): boolean =>
    nodes.some((node) => {
        if (
            (node as any).type === ELEMENT_IMAGE_PLACEHOLDER &&
            (node as any).status === 'uploading'
        ) {
            return true;
        }
        return (
            'children' in node &&
            Array.isArray(node.children) &&
            hasUploadingPlaceholder(node.children)
        );
    });

/**
 * Drop every transient `image_placeholder` node from a document so abandoned
 * (errored / in-flight) uploads are never persisted.
 */
export function stripUploadPlaceholders(value: Value): Value {
    return withoutPlaceholders(value) as Value;
}

/**
 * True when any `image_placeholder` is still uploading — used to block save
 * until in-flight uploads finish.
 */
export function hasPendingUploads(value: Value): boolean {
    return hasUploadingPlaceholder(value);
}
