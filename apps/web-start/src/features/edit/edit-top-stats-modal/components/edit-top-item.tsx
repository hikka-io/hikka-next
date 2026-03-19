import { UserResponse } from '@hikka/client';
import { FC } from 'react';

import { MaterialSymbolsKidStar } from '@/components/icons/material-symbols/MaterialSymbolsKidStar';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

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
        <HorizontalCard>
            <HorizontalCardImage
                image={user.avatar}
                imageRatio={1}
                href={`/u/${user.username}`}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle href={`/u/${user.username}`}>
                    {user.username}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    <div className="text-muted-foreground flex items-center gap-2">
                        <div className="bg-success-foreground flex size-2 items-center justify-center rounded-full" />
                        <small>{accepted}</small>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                        <div className="bg-destructive-foreground flex size-2 items-center justify-center rounded-full" />
                        <small>{denied}</small>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                        <div className="bg-muted-foreground flex size-2 items-center justify-center rounded-full" />
                        <small>{closed}</small>
                    </div>
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {rank <= 3 && (
                <MaterialSymbolsKidStar
                    className={cn(
                        'text-lg',
                        rank === 1
                            ? 'text-yellow-300'
                            : rank === 2
                              ? 'text-slate-300'
                              : 'text-amber-700',
                    )}
                />
            )}
        </HorizontalCard>
    );
};

export default EditTopItem;
