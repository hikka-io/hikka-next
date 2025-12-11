/**
 * Appearance utilities barrel export
 */

// Defaults
export { DEFAULT_APPEARANCE, DEFAULT_STYLES } from './defaults';

// Merge utilities
export { mergeEffects, mergeStyles } from './merge';

// Color utilities
export {
    formatHSL,
    hexToHsl,
    hslToHex,
    toHikkaColor,
    toHSLString,
    toReactColorful,
} from './color';

// Style injection
export {
    applyStyles,
    injectStyles,
    removeInjectedStyles,
    STYLE_ELEMENT_ID,
    stylesToCSS,
} from './inject-styles';

// UI Cookie storage
export {
    cookieStorage,
    parseAppearanceFromCookie,
    UI_COOKIE_NAME,
} from './ui-cookie';

// Server utilities (re-exported for convenience, but should be imported from ./server directly)
// Note: These are async and server-only

