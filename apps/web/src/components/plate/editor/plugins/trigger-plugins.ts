import { isServer } from '@/utils/is-server';

import {
    CONTENT_SEARCH_INPUT_KEY,
    CONTENT_SEARCH_KEY,
} from './content-search-kit';
import { USER_SEARCH_INPUT_KEY, USER_SEARCH_KEY } from './user-search-kit';

const TRIGGER_KEYS = new Set<string>([
    CONTENT_SEARCH_KEY,
    CONTENT_SEARCH_INPUT_KEY,
    USER_SEARCH_KEY,
    USER_SEARCH_INPUT_KEY,
]);

const isTouchDevice = () =>
    !isServer() && window.matchMedia('(pointer: coarse)').matches;

/**
 * The `@`/`#` triggers put the query in an input of their own, and focusing it
 * closes the Android keyboard — leaving nothing to type the query into. Touch
 * devices reach the same pickers through the toolbar instead.
 */
export const withoutTriggerPlugins = <T extends { key: string }>(
    plugins: T[],
): T[] =>
    isTouchDevice()
        ? plugins.filter((plugin) => !TRIGGER_KEYS.has(plugin.key))
        : plugins;
