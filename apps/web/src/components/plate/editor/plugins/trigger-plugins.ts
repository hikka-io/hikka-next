import { isServer } from '@/utils/is-server';

import {
    BLOCK_PLACEHOLDER_KEY,
    BLOCK_SELECTION_KEY,
    CONTENT_SEARCH_INPUT_KEY,
    CONTENT_SEARCH_KEY,
    DND_KEY,
    SLASH_INPUT_KEY,
    SLASH_KEY,
    USER_SEARCH_INPUT_KEY,
    USER_SEARCH_KEY,
} from './trigger-keys';

const TRIGGER_KEYS = new Set<string>([
    CONTENT_SEARCH_KEY,
    CONTENT_SEARCH_INPUT_KEY,
    USER_SEARCH_KEY,
    USER_SEARCH_INPUT_KEY,
    SLASH_KEY,
    SLASH_INPUT_KEY,
    DND_KEY,
    BLOCK_SELECTION_KEY,
    BLOCK_PLACEHOLDER_KEY,
]);

export const isTouchDevice = () =>
    !isServer() && window.matchMedia('(pointer: coarse)').matches;

/**
 * The `@`/`#`/`/` triggers put the query in an input of their own, and focusing it
 * closes the Android keyboard — leaving nothing to type the query into. Touch
 * devices reach the same pickers through the toolbar instead. They also skip
 * the mouse-only block handles, block selection and the "/" hint on empty lines.
 */
export const withoutTriggerPlugins = <T extends { key: string }>(
    plugins: T[],
): T[] =>
    isTouchDevice()
        ? plugins.filter((plugin) => !TRIGGER_KEYS.has(plugin.key))
        : plugins;
