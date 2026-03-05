'use client';

import { useSession, useUserFollowStats } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import FollowButton from '@/components/follow-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import FollowListModal from './followlist-modal';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';

interface Props {
    className?: string;
}

const FollowStats: FC<Props> = ({ className }) => {
    const { openModal } = useModalContext();
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data: followStats } = useUserFollowStats({
        username: String(params.username),
    });

    if (!followStats) {
        return null;
    }

    return (
        <Card
            className={cn(
                'flex-col lg:flex-row items-center bg-secondary/20 backdrop-blur p-2 gap-2 w-full md:w-auto',
                className,
            )}
        >
            <div className='flex gap-2 h-full w-full items-center'>
                <Button
                    onClick={() =>
                        openModal({
                            content: <FollowListModal type="followers" />,
                            title: 'Стежать',
                            type: 'sheet',
                        })
                    }
                    variant="ghost"
                    className="flex flex-col gap-0 p-2 h-auto w-auto text-foreground flex-1"
                >
                    <span className="font-bold">
                        {followStats.followers}
                    </span>
                    <span className="text-muted-foreground">стежать</span>
                </Button>
                <Separator orientation="vertical" className='h-8' />
                <Button
                    variant="ghost"
                    onClick={() =>
                        openModal({
                            content: <FollowListModal type="followings" />,
                            title: 'Відстежується',
                            type: 'sheet',
                        })
                    }
                    className="flex flex-col gap-0 p-2 h-auto w-auto text-foreground flex-1"
                >
                    <span className="font-bold">
                        {followStats.following}
                    </span>
                    <span className="text-muted-foreground">
                        відстежується
                    </span>
                </Button>
            </div>
            {loggedUser?.username !== String(params.username) && <Separator orientation="vertical" className='h-8 hidden lg:block' />}

            {loggedUser?.username !== String(params.username) && <div className="p-2 flex gap-4 w-full">
                <FollowButton
                    size="md"
                    username={String(params.username)}
                    className='flex-1'
                />
            </div>}
        </Card>
    );
};

export default FollowStats;
