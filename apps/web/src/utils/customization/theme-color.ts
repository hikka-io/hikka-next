import { COOKIE } from '@/utils/cookies/constants';

/**
 * Browser-chrome tint (Android status/nav bar, Safari UI). Must track the
 * `--background` token in globals.css, or the bars render as mismatched bands.
 */
export const THEME_COLOR = {
    dark: '#000000',
    light: '#ffffff',
} as const satisfies Record<'dark' | 'light', string>;

export const THEME_BOOTSTRAP_SCRIPT = `(function(){var t='dark';try{var c=document.cookie.match(/(?:^|;\\s*)${COOKIE.theme.name}=([^;]*)/);t=c?decodeURIComponent(c[1]):'dark';if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}}catch(e){t='dark';}if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;var m=document.createElement('meta');m.name='theme-color';m.content=t==='light'?'${THEME_COLOR.light}':'${THEME_COLOR.dark}';document.head.appendChild(m);})();`;

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
