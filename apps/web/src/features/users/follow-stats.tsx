'use client';

import { useUserFollowStats } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { FollowListModal } from '@/features/modals';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const FollowStats: FC<Props> = ({ className }) => {
    const { openModal } = useModalContext();
    const params = useParams();

    const { data: followStats } = useUserFollowStats({
        username: String(params.username),
    });

    if (!followStats) {
        return null;
    }

    return (
        <div className={cn('flex h-fit gap-6', className)}>
            <Button
                size="md"
                onClick={() =>
                    openModal({
                        content: <FollowListModal type="followers" />,
                        title: 'Стежать',
                        type: 'sheet',
                    })
                }
                variant="link"
                className="p-0 text-foreground"
            >
                <span className="font-bold">
                    {followStats ? followStats.followers : 0}
                    <Label className="text-muted-foreground"> стежать</Label>
                </span>
            </Button>
            <Button
                size="md"
                variant="link"
                onClick={() =>
                    openModal({
                        content: <FollowListModal type="followings" />,
                        title: 'Відстежується',
                        type: 'sheet',
                    })
                }
                className="p-0 text-foreground"
            >
                <Label>
                    <span className="font-bold">
                        {followStats ? followStats.following : 0}
                        <Label className="text-muted-foreground">
                            {' '}
                            відстежується
                        </Label>
                    </span>
                </Label>
            </Button>
        </div>
    );
};

export default FollowStats;
