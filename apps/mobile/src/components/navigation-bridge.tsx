import { type FC, useEffect } from 'react';

import { useNavigationContainerRef } from 'expo-router';

import { setProfileOpener } from '@/utils/offline-toast';

// Every route of the root stack above `(tabs)` is a sheet or a dev screen covering the tabs.
const TABS_ROUTE = '(tabs)';
const PROFILE_TAB = '(profile)';

type NavState = {
    key: string;
    index?: number;
    routes: { name: string; state?: NavState }[];
};

// The container wraps the root layout's stack in its own route, so look for the stack that holds `(tabs)`.
const findRootStack = (state: NavState | undefined): NavState | undefined => {
    let current = state;

    while (current) {
        if (current.routes.some((route) => route.name === TABS_ROUTE)) {
            return current;
        }
        current = current.routes[current.index ?? 0]?.state;
    }

    return undefined;
};

/**
 * Lets `toastApiError` open the Profile tab from outside React: a tab jump keeps every tab's stack, and
 * nothing opens while a root sheet is on top, because leaving it would close the sheet and its input.
 */
const NavigationBridge: FC = () => {
    const navigation = useNavigationContainerRef();

    useEffect(() => {
        const update = () => {
            const stack = findRootStack(
                navigation.getRootState() as unknown as NavState | undefined,
            );
            const top = stack?.routes[stack.index ?? 0];
            const tabs = top?.name === TABS_ROUTE ? top.state : undefined;

            setProfileOpener(
                tabs
                    ? () =>
                          navigation.dispatch({
                              type: 'JUMP_TO',
                              payload: { name: PROFILE_TAB },
                              target: tabs.key,
                          })
                    : null,
            );
        };

        if (navigation.isReady()) update();
        const unsubscribe = navigation.addListener('state', update);

        return () => {
            unsubscribe();
            setProfileOpener(null);
        };
    }, [navigation]);

    return null;
};

export default NavigationBridge;
