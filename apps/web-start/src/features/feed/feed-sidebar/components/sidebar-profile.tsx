'use client';

import { useSession, useUserFollowStats } from '@hikka/react';
import { Settings } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import { LoginButton } from '@/features/common';
import FollowListModal from '@/features/users/followlist-modal';

import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { Link } from '@/utils/navigation';

const SidebarProfile = () => {
    const [open, setOpen] = useState(false);
    const [followType, setFollowType] = useState<'followers' | 'followings'>(
        'followers',
    );
    useCloseOnRouteChange(setOpen);
    const { user } = useSession();
    const { data: followStats } = useUserFollowStats({
        username: String(user?.username),
    });

    if (!user || !followStats) {
        return (
            <Card className="bg-secondary/20 items-center" id="sidebar-profile">
                <div className="flex w-full flex-col gap-2">
                    <p className="text-sm font-bold">Приєднуйся до hikka</p>
                    <p className="text-muted-foreground text-xs">
                        Відслідковуй свій прогрес, створюй власні колекції та
                        веди обговорення зі спільнотою
                    </p>
                </div>
                <LoginButton className="w-full" variant="secondary" />
            </Card>
        );
    }

    return (
        <>
            <Card
                className="bg-secondary/20 hidden items-center xl:flex backdrop-blur-xl"
                id="sidebar-profile"
            >
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <Link to={`/u/${user.username}`}>
                            <Avatar className="size-12 rounded-lg">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="rounded-lg">
                                    {user.username[0]}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className="flex flex-col gap-2">
                            <Link
                                to={`/u/${user.username}`}
                                className="text-sm font-bold hover:underline"
                            >
                                {user.username}
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon-md" asChild>
                            <Link to="/settings">
                                <Settings />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex h-full w-full items-center gap-4">
                    <button
                        onClick={() => {
                            setFollowType('followers');
                            setOpen(true);
                        }}
                        className="flex cursor-pointer gap-1 text-sm hover:underline"
                    >
                        <span className="font-bold">
                            {followStats.followers}
                        </span>
                        <span className="text-muted-foreground">стежать</span>
                    </button>
                    <button
                        onClick={() => {
                            setFollowType('followings');
                            setOpen(true);
                        }}
                        className="flex cursor-pointer gap-1 text-sm hover:underline"
                    >
                        <span className="font-bold">
                            {followStats.following}
                        </span>
                        <span className="text-muted-foreground">
                            відстежується
                        </span>
                    </button>
                </div>
            </Card>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent
                    side="right"
                    title={
                        followType === 'followers' ? 'Стежать' : 'Відстежується'
                    }
                >
                    <FollowListModal
                        type={followType}
                        username={user.username}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default SidebarProfile;
