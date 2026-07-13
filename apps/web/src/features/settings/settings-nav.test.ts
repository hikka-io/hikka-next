import { describe, expect, it } from 'vitest';

import { SETTINGS_MENU } from '@/utils/constants/navigation';

import {
    getActiveTopLevelHref,
    isGroupActive,
    isNavLinkActive,
} from './settings-nav';

describe('isNavLinkActive', () => {
    it('matches only the exact path', () => {
        expect(
            isNavLinkActive('/settings/list/import', '/settings/list/import'),
        ).toBe(true);
        expect(
            isNavLinkActive('/settings/list/import', '/settings/list/export'),
        ).toBe(false);
        expect(isNavLinkActive('/settings/list', '/settings/list/import')).toBe(
            false,
        );
    });
});

describe('isGroupActive', () => {
    it('matches the parent itself and its descendants', () => {
        expect(isGroupActive('/settings/list', '/settings/list')).toBe(true);
        expect(isGroupActive('/settings/list', '/settings/list/import')).toBe(
            true,
        );
        expect(isGroupActive('/settings/list', '/settings/list/export')).toBe(
            true,
        );
    });

    it('does not match a sibling that only shares a string prefix', () => {
        expect(isGroupActive('/settings/list', '/settings/list-archive')).toBe(
            false,
        );
    });

    it('does not match an unrelated path', () => {
        expect(isGroupActive('/settings/list', '/settings/profile')).toBe(
            false,
        );
    });
});

describe('getActiveTopLevelHref', () => {
    it('resolves the owning top-level item for a sub-route', () => {
        expect(
            getActiveTopLevelHref(
                SETTINGS_MENU,
                '/settings/customization/effects',
            ),
        ).toBe('/settings/customization');
    });

    it('resolves a leaf top-level item', () => {
        expect(getActiveTopLevelHref(SETTINGS_MENU, '/settings/profile')).toBe(
            '/settings/profile',
        );
    });

    it('returns undefined when nothing matches', () => {
        expect(
            getActiveTopLevelHref(SETTINGS_MENU, '/somewhere/else'),
        ).toBeUndefined();
    });
});
