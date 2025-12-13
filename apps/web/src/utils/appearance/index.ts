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
    toHSLString,
    toHikkaColor,
    toReactColorful,
} from './color';

// Style injection
export {
    STYLE_ELEMENT_ID,
    applyStyles,
    injectStyles,
    removeInjectedStyles,
    stylesToCSS,
} from './inject-styles';
