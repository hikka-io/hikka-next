import Link from 'next/link';
import { FC } from 'react';

import MaterialSymbolsKidStar from '@/components/icons/material-symbols/MaterialSymbolsKidStar';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/utils/utils';

interface Props {
    user: API.User;
    rank: number;
    accepted: number;
    closed: number;
    denied: number;
}

const EditTopItem: FC<Props> = ({ user, rank, accepted, denied, closed }) => {
    return (
        <div
            className={cn(
                'relative flex w-full min-w-0 flex-1 items-center gap-4 rounded-md p-4',
                'border border-secondary/60 bg-secondary/30',
            )}
        >
            <MaterialSymbolsKidStar
                className={cn(
                    'absolute text-lg',
                    rank === 1
                        ? 'text-yellow-300'
                        : rank === 2
                          ? 'text-slate-300'
                          : 'text-amber-700',
                    'right-2 top-2 lg:-right-2 lg:-top-2',
                    rank > 3 && 'hidden',
                )}
            />
            <Link href={`/u/${user.username}`}>
                <Avatar className="w-10 rounded-md">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="w-10 rounded-md" />
                </Avatar>
            </Link>
            <div className="flex min-w-0 flex-col gap-1">
                <Label className="truncate">
                    <Link className="truncate" href={`/u/${user.username}`}>
                        {user.username}
                    </Link>
                </Label>

                <div className="flex gap-3">
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="flex size-2 items-center justify-center rounded-full bg-success" />
                                <Small>{accepted}</Small>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Прийнято</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="flex size-2 items-center justify-center rounded-full bg-destructive" />
                                <Small>{denied}</Small>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Відхилено</TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="flex size-2 items-center justify-center rounded-full bg-muted-foreground" />
                                <Small>{closed}</Small>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Закрито</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default EditTopItem;
