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
        <HorizontalCard
            className="w-full px-6 py-4"
        >
            <HorizontalCardImage image={user.avatar} imageRatio={1} href={`/u/${user.username}`} />
            <HorizontalCardContainer>
                <HorizontalCardTitle href={`/u/${user.username}`}>{user.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-success-foreground" />
                        <small>{accepted}</small>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-destructive-foreground" />
                        <small>{denied}</small>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-muted-foreground" />
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
