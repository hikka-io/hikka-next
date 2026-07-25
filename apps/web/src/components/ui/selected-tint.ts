/**
 * Tint that marks the selected item of a group — chip tabs, feed quick
 * filters, navbar links, tab bar tabs. Kept in one place so "you are here"
 * reads the same everywhere. Solid `bg-primary` stays reserved for selected
 * filter values (badge filters, calendar days, pagination pages).
 */
export const SELECTED_TINT =
    'border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground';

/** Hover state for an item that is already selected. */
export const SELECTED_TINT_HOVER =
    'hover:bg-primary-foreground/20 hover:text-primary-foreground dark:hover:bg-primary-foreground/20';
