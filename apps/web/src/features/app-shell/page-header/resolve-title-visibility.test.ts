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
                anchorReachable: true,
            }),
        ).toBe(false);
    });

    it('shows the title on pages without an anchor', () => {
        expect(
            resolveTitleVisibility({
                config: plainConfig,
                hasAnchor: false,
                passedAnchor: false,
                anchorReachable: true,
            }),
        ).toBe(true);
    });

    it('hides the title on an anchored page whose anchor has not mounted', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: false,
                passedAnchor: true,
                anchorReachable: true,
            }),
        ).toBe(false);
    });

    it('hides the title while the mounted anchor is still in view', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: true,
                passedAnchor: false,
                anchorReachable: true,
            }),
        ).toBe(false);
    });

    it('shows the title once the mounted anchor is scrolled past', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: true,
                passedAnchor: true,
                anchorReachable: true,
            }),
        ).toBe(true);
    });

    it('shows the title when the page is too short to scroll past the anchor', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: true,
                passedAnchor: false,
                anchorReachable: false,
            }),
        ).toBe(true);
    });

    it('keeps the title hidden on a short page whose anchor has not mounted', () => {
        expect(
            resolveTitleVisibility({
                config: anchoredConfig,
                hasAnchor: false,
                passedAnchor: false,
                anchorReachable: false,
            }),
        ).toBe(false);
    });
});
