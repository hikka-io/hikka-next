import { describe, expect, it } from 'vitest';

import type { PageHeaderConfig } from './page-header-context';
import { resolveTitleVisibility } from './resolve-title-visibility';

const anchoredConfig: PageHeaderConfig = { title: 'Test', anchored: true };
const plainConfig: PageHeaderConfig = { title: 'Test' };

describe('resolveTitleVisibility', () => {
    it('hides the title while no config is registered', () => {
        expect(
            resolveTitleVisibility({
                config: null,
                hasAnchor: false,
                passedAnchor: false,
            }),
        ).toBe(false);
    });

    it('shows the title on pages without an anchor', () => {
        expect(
            resolveTitleVisibility({
                config: plainConfig,
                hasAnchor: false,
                passedAnchor: false,
            }),
        ).toBe(true);
    });

    it('hides the title on an anchored page whose anchor has not mounted', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: false,
                passedAnchor: true,
            }),
        ).toBe(false);
    });

    it('hides the title while the mounted anchor is still in view', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: true,
                passedAnchor: false,
            }),
        ).toBe(false);
    });

    it('shows the title once the mounted anchor is scrolled past', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: true,
                passedAnchor: true,
            }),
        ).toBe(true);
    });
});
