import { UserResponse } from '@hikka/client';
import { FC } from 'react';

import MaterialSymbolsKidStar from '@/components/icons/material-symbols/MaterialSymbolsKidStar';
import Small from '@/components/typography/small';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/utils/cn';

interface Props {
    user: UserResponse;
    rank: number;
    accepted: number;
    closed: number;
    denied: number;
}

const EditTopItem: FC<Props> = ({ user, rank, accepted, denied, closed }) => {
    return (
        <Card className="flex-1">
            <HorizontalCard href={`/u/${user.username}`}>
                <HorizontalCardImage
                    className="w-10"
                    image={user.avatar}
                    imageRatio={1}
                />
                <HorizontalCardContainer>
                    <div className="inline-flex items-center justify-between">
                        <HorizontalCardTitle>
                            {user.username}
                        </HorizontalCardTitle>
                        <MaterialSymbolsKidStar
                            className={cn(
                                'text-lg',
                                rank === 1
                                    ? 'text-yellow-300'
                                    : rank === 2
                                      ? 'text-slate-300'
                                      : 'text-amber-700',
                                rank > 3 && 'hidden',
                            )}
                        />
                    </div>

                    <HorizontalCardDescription>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="flex size-2 items-center justify-center rounded-full bg-success-foreground" />
                                    <Small>{accepted}</Small>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>Прийнято</TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="flex size-2 items-center justify-center rounded-full bg-destructive-foreground" />
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
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCard>
        </Card>
    );
};

export default EditTopItem;
