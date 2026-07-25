/**
 * Browser-chrome tint (Android status/nav bar, Safari UI). Must track the
 * `--background` token in globals.css and the hexes in the __root.tsx FOUC
 * script, or the bars render as mismatched bands.
 */
export const THEME_COLOR = {
    dark: '#000000',
    light: '#ffffff',
} as const satisfies Record<'dark' | 'light', string>;

/**
 * Points `meta[name="theme-color"]` at the applied theme. The meta is created
 * by the FOUC script in __root.tsx — head() must never own it (see there).
 */
export function syncThemeColorMeta(resolved: 'light' | 'dark') {
    let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
    );

    if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
    }

    meta.content = THEME_COLOR[resolved];
}
