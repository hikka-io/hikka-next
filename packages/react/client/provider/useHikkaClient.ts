'use client';

import { useContext } from 'react';

import { HikkaContext } from './context';

/**
 * Hook to access the Hikka client from context.
 * Must be used within a HikkaProvider.
 */
export function useHikkaClient() {
    const context = useContext(HikkaContext);

    if (!context) {
        throw new Error(
            'useHikkaClient must be used within a HikkaProvider. ' +
                'Make sure you have wrapped your application with HikkaProvider.',
        );
    }

    return context;
}
