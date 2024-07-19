'use client';

import {
    useMarkToolbarButton,
    useMarkToolbarButtonState,
} from '@udecode/plate-common';

import { withRef } from '@/utils/utils';

import { ToolbarButton } from './toolbar';

export const MarkToolbarButton = withRef<
    typeof ToolbarButton,
    {
        nodeType: string;
        clear?: string | string[];
    }
>(({ clear, nodeType, ...rest }, ref) => {
    const state = useMarkToolbarButtonState({ clear, nodeType });
    const { props } = useMarkToolbarButton(state);

    return <ToolbarButton ref={ref} {...props} {...rest} />;
});
