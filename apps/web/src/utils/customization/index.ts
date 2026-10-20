export {
    applyBackdrop,
    BACKDROP_ATTR,
    backdropVars,
    type ResolvedBackdrop,
    resolveBackdrop,
} from './backdrop';
export { type EventTheme, getActiveEventTheme } from './event-themes';
export {
    applyStyles,
    injectStyles,
    removeInjectedStyles,
    STYLE_ELEMENT_ID,
    SURFACE_OVERRIDE_TOKENS,
    stylesToCSS,
} from './inject-styles';
export {
    clearLivePreview,
    type LivePreviewVar,
    setLiveVar,
} from './live-preview';
export {
    diffStyles,
    mergeEffects,
    mergePreferences,
    mergeStyles,
    type UIEffect,
} from './merge';
export {
    syncThemeColorMeta,
    THEME_BOOTSTRAP_SCRIPT,
    THEME_COLOR,
} from './theme-color';
export { getUserStyles, mergeUserStyles } from './user-styles';
