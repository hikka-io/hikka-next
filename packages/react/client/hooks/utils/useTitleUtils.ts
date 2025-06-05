import { useCallback } from 'react';

import { useHikkaClient } from '@/client/provider';
import { addDeepTitleProperties, addTitleProperty } from '@/utils';

export function useTitleUtils() {
    const { defaultOptions } = useHikkaClient();

    const _addTitleProperty = useCallback(
        (obj: any) => {
            return addTitleProperty(obj, defaultOptions?.title);
        },
        [defaultOptions?.title],
    );

    const _addDeepTitleProperties = useCallback(
        (obj: any) => {
            return addDeepTitleProperties(obj, defaultOptions?.title);
        },
        [defaultOptions?.title],
    );

    return {
        addTitleProperty: _addTitleProperty,
        addDeepTitleProperties: _addDeepTitleProperties,
    };
}
