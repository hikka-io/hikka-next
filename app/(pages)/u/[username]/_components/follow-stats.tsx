'use client';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import FollowlistModal from '@/app/_components/modals/followlist-modal';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import getFollowStats from '@/app/_utils/api/follow/getFollowStats';
import { useModalContext } from '@/app/_utils/providers/modal-provider';

interface Props {}

const Component = ({}: Props) => {
    const { openModal } = useModalContext();
    const params = useParams();

    const { data: followStats } = useQuery({
        queryKey: ['followStats', params.username],
        queryFn: () => getFollowStats({ username: String(params.username) }),
    });

    if (!followStats) {
        return null;
    }

    return (
        <div className="flex h-fit gap-2 rounded-lg border border-secondary/60 bg-secondary/30 p-2">
            <Button
                onClick={() =>
                    openModal({
                        content: <FollowlistModal type="followers" />,
                        title: 'Стежать',
                        type: 'sheet',
                    })
                }
                className="flex flex-1 flex-col items-center justify-center gap-2 p-2"
                variant="ghost"
            >
                <Label>
                    <span className="font-bold">
                        {followStats ? followStats.followers : 0}
                    </span>
                </Label>
                <Label className="text-muted-foreground">стежать</Label>
            </Button>
            <Button
                variant="ghost"
                onClick={() =>
                    openModal({
                        content: <FollowlistModal type="followings" />,
                        title: 'Відстежується',
                        type: 'sheet',
                    })
                }
                className="flex flex-1 flex-col items-center justify-center gap-2 p-2"
            >
                <Label>
                    <span className="font-bold">
                        {followStats ? followStats.following : 0}
                    </span>
                </Label>
                <Label className="text-muted-foreground">відстежується</Label>
            </Button>
        </div>
    );
};

export default Component;