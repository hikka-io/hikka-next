import { FC } from 'react';

import { MaterialSymbolsKidStar } from '@/components/icons/material-symbols/MaterialSymbolsKidStar';
import Small from '@/components/typography/small';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
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
        <HorizontalCard
            className="w-full px-6 py-4"
            href={`/u/${user.username}`}
        >
            <HorizontalCardImage image={user.avatar} imageRatio={1} />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{user.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-success" />
                        <Small>{accepted}</Small>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-destructive" />
                        <Small>{denied}</Small>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-muted-foreground" />
                        <Small>{closed}</Small>
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
