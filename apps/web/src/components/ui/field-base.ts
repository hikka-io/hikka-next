/**
 * Shared visual base for form-field controls (input, textarea, select trigger,
 * date-picker trigger) so they stay pixel-consistent. Follows the shadcn field
 * model: transparent fill with a translucent dark lift, `border-input`, a soft
 * shadow, and the `ring-[3px] ring-ring/50` focus + `aria-invalid` states.
 *
 * Sizing (height/padding) stays per-control since it varies.
 */
export const FIELD_BASE =
    'w-full min-w-0 rounded-lg border border-input bg-transparent text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40';
