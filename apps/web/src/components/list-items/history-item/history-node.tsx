import type { ComponentType, FC } from 'react';

import { BookOpen, Calendar, Download, Undo2 } from 'lucide-react';

import type { UserResponse } from '@hikka/api';

import { LIST_STATUS_ICONS } from '@/components/icons/list-status-icons';
import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import MaterialSymbolsHeartMinusRounded from '@/components/icons/material-symbols/MaterialSymbolsHeartMinusRounded';
import MaterialSymbolsPlayArrowRounded from '@/components/icons/material-symbols/MaterialSymbolsPlayArrowRounded';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import type { HistoryEntry, HistoryIcon } from './types';

type Icon = ComponentType<{ className?: string }>;

type Props = {
    entry: HistoryEntry;
    user?: UserResponse;
};

const NEUTRAL = 'bg-secondary text-muted-foreground';

const ICONS: Record<
    Exclude<HistoryIcon['kind'], 'status' | 'progress'>,
    Icon
> = {
    rollback: Undo2,
    score: MaterialSymbolsStarRounded,
    date: Calendar,
    updated: MaterialSymbolsEditRounded,
    delete: MaterialSymbolsDeleteForeverRounded,
    'favourite-add': MaterialSymbolsFavoriteRounded,
    'favourite-remove': MaterialSymbolsHeartMinusRounded,
    import: Download,
};

const PROGRESS_ICONS: Record<HistoryEntry['medium'], Icon> = {
    watch: MaterialSymbolsPlayArrowRounded,
    read: BookOpen,
};

const getAppearance = ({ medium, icon }: HistoryEntry) => {
    switch (icon.kind) {
        case 'status':
            return {
                Icon: (LIST_STATUS_ICONS[medium] as Record<string, Icon>)[
                    icon.status
                ],
                tone: `bg-${icon.status} text-${icon.status}-foreground`,
            };
        case 'progress':
            return { Icon: PROGRESS_ICONS[medium], tone: NEUTRAL };
        case 'favourite-add':
            return {
                Icon: ICONS[icon.kind],
                tone: 'bg-primary text-primary-foreground',
            };
        case 'delete':
            return {
                Icon: ICONS[icon.kind],
                tone: 'bg-destructive text-destructive-foreground',
            };
        default:
            return { Icon: ICONS[icon.kind], tone: NEUTRAL };
    }
};

const HistoryNode: FC<Props> = ({ entry, user }) => {
    const { Icon, tone } = getAppearance(entry);

    if (!user) {
        return (
            <span
                className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-md',
                    tone,
                )}
            >
                <Icon className="size-4" />
            </span>
        );
    }

    return (
        <Link
            to={`/u/${user.username}`}
            aria-label={user.username ?? undefined}
            className="relative size-8 shrink-0"
        >
            <Avatar className="size-8 rounded-md">
                <AvatarImage className="rounded-md" src={user.avatar} />
                <AvatarFallback className="rounded-md text-xs">
                    {user.username?.[0]}
                </AvatarFallback>
            </Avatar>
            <span
                className={cn(
                    'absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-sm',
                    tone,
                )}
            >
                <Icon className="size-2.5" />
            </span>
        </Link>
    );
};

export default HistoryNode;
