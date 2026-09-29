import { describe, expect, it } from 'vitest';

import { THEME_BOOTSTRAP_SCRIPT } from './theme-color';

const ROOT_INLINE_SCRIPT = `(function(){var t='dark';try{var c=document.cookie.match(/(?:^|;\\s*)theme=([^;]*)/);t=c?decodeURIComponent(c[1]):'dark';if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}}catch(e){t='dark';}if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;var m=document.createElement('meta');m.name='theme-color';m.content=t==='light'?'#ffffff':'#000000';document.head.appendChild(m);})();`;

describe('THEME_BOOTSTRAP_SCRIPT', () => {
    it('is byte-identical to the inline FOUC script it replaced', () => {
        expect(THEME_BOOTSTRAP_SCRIPT).toBe(ROOT_INLINE_SCRIPT);
    });

    it('emits a single-backslash \\s in the cookie regex', () => {
        expect(THEME_BOOTSTRAP_SCRIPT).toContain('/(?:^|;\\s*)theme=([^;]*)/');
    });
});
