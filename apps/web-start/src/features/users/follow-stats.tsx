import { type FC, useState } from 'react';

import { useSession, useUserFollowStats } from '@hikka/react';

import FollowButton from '@/components/action-buttons/follow-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { Separator } from '@/components/ui/separator';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import FollowListModal from './follow-list-modal';

type Props = {
    className?: string;
};

const FollowStats: FC<Props> = ({ className }) => {
    const [open, setOpen] = useState(false);
    const [followType, setFollowType] = useState<'followers' | 'followings'>(
        'followers',
    );
    useCloseOnRouteChange(setOpen);
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data: followStats } = useUserFollowStats({
        username: String(params.username),
    });

    if (!followStats) {
        return null;
    }

    return (
        <>
            <Card
                className={cn(
                    'w-full flex-col items-center gap-2 bg-secondary/20 p-2 backdrop-blur md:w-auto lg:flex-row',
                    className,
                )}
            >
                <div className="flex h-full w-full items-center gap-2">
                    <Button
                        onClick={() => {
                            setFollowType('followers');
                            setOpen(true);
                        }}
                        variant="ghost"
                        className="flex h-auto w-auto flex-1 flex-col gap-0 p-2 text-foreground"
                    >
                        <span className="font-bold">
                            {followStats.followers}
                        </span>
                        <span className="text-muted-foreground">стежать</span>
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setFollowType('followings');
                            setOpen(true);
                        }}
                        className="flex h-auto w-auto flex-1 flex-col gap-0 p-2 text-foreground"
                    >
                        <span className="font-bold">
                            {followStats.following}
                        </span>
                        <span className="text-muted-foreground">
                            відстежується
                        </span>
                    </Button>
                </div>
                {loggedUser?.username !== String(params.username) && (
                    <Separator
                        orientation="vertical"
                        className="hidden h-8 lg:block"
                    />
                )}

                {loggedUser?.username !== String(params.username) && (
                    <div className="flex w-full gap-4 p-2">
                        <FollowButton
                            size="md"
                            username={String(params.username)}
                            className="flex-1"
                        />
                    </div>
                )}
            </Card>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent
                    side="right"
                    title={
                        followType === 'followers' ? 'Стежать' : 'Відстежується'
                    }
                >
                    <FollowListModal type={followType} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default FollowStats;
