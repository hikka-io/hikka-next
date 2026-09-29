import type { ComponentType, SVGProps } from 'react';

import type { EditStatusEnum } from '@hikka/api';

import MaterialSymbolsCheckRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import MaterialSymbolsHourglassEmptyRounded from '@/components/icons/material-symbols/MaterialSymbolsHourglassEmptyRounded';
import Closed from '@/components/icons/watch-status/dropped';
import type { BadgeProps } from '@/components/ui/badge';

export const EDIT_STATUS_STYLE = {
    pending: {
        variant: 'warning',
        icon: MaterialSymbolsHourglassEmptyRounded,
    },
    accepted: {
        variant: 'success',
        icon: MaterialSymbolsCheckRounded,
    },
    denied: {
        variant: 'destructive',
        icon: MaterialSymbolsCloseRounded,
    },
    closed: {
        variant: 'secondary',
        icon: Closed,
    },
} as const satisfies Record<
    EditStatusEnum,
    {
        variant: NonNullable<BadgeProps['variant']>;
        icon: ComponentType<SVGProps<SVGSVGElement>>;
    }
>;
