import type { FC } from 'react';

import MaterialSymbolsSecurity from '@/components/icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '@/components/icons/material-symbols/MaterialSymbolsShieldPerson';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

const ROLE = {
    admin: {
        icon: MaterialSymbolsSecurity,
        className: 'text-role-admin',
        label: 'Адміністратор',
    },
    moderator: {
        icon: MaterialSymbolsShieldPerson,
        className: 'text-role-moderator',
        label: 'Модератор',
    },
} as const;

type Props = {
    role?: string | null;
    // `boxed` (default) draws the bordered inset chip used in profiles/tooltips;
    // `inline` is the bare icon used in the comment/feed meta row.
    variant?: 'boxed' | 'inline';
};

const RoleBadge: FC<Props> = ({ role, variant = 'boxed' }) => {
    const config =
        role === 'admin' || role === 'moderator' ? ROLE[role] : undefined;
    if (!config) return null;

    const Icon = config.icon;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger
                className={variant === 'inline' ? 'flex shrink-0' : 'shrink-0'}
            >
                <div
                    className={cn(
                        'font-bold text-xs',
                        variant === 'boxed' &&
                            'surface-inset rounded-sm border border-border p-1',
                    )}
                >
                    <Icon className={config.className} />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{config.label}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default RoleBadge;
