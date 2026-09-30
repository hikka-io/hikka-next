import { isRedirect } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import { Route as ApplicationsRoute } from '../../routes/_pages/settings/applications/index';
import { Route as CustomizationRoute } from '../../routes/_pages/settings/customization/index';
import { Route as SettingsRoute } from '../../routes/_pages/settings/index';
import { Route as ListSettingsRoute } from '../../routes/_pages/settings/list/index';
import { Route as UserListRoute } from '../../routes/_pages/u/$username/list/index';

type Hooked = {
    options: {
        beforeLoad?: unknown;
        loader?: unknown;
    };
};

function redirectFrom(route: Hooked, ctx: object = {}) {
    const beforeLoad = route.options.beforeLoad as (ctx: object) => unknown;
    try {
        beforeLoad(ctx);
    } catch (error) {
        if (isRedirect(error)) return error.options;
        throw error;
    }
    return undefined;
}

const SETTINGS_CASES = [
    { name: 'settings', route: SettingsRoute, to: '/settings/profile' },
    {
        name: 'applications',
        route: ApplicationsRoute,
        to: '/settings/applications/authorized',
    },
    {
        name: 'customization',
        route: CustomizationRoute,
        to: '/settings/customization/general',
    },
    {
        name: 'list',
        route: ListSettingsRoute,
        to: '/settings/list/import',
    },
];

describe('settings index redirects', () => {
    it.each(SETTINGS_CASES)(
        'redirects $name from beforeLoad, not from a loader',
        ({ route, to }) => {
            expect(redirectFrom(route)).toMatchObject({ to });
            expect(route.options.loader).toBeUndefined();
        },
    );
});

describe('user list index redirect', () => {
    it('redirects to the completed anime list from beforeLoad', () => {
        expect(
            redirectFrom(UserListRoute, { params: { username: 'tester' } }),
        ).toMatchObject({
            to: '/u/$username/list/$content_type',
            params: { username: 'tester', content_type: 'anime' },
            search: { status: 'completed', sort: 'watch_score' },
        });
        expect(UserListRoute.options.loader).toBeUndefined();
    });
});
