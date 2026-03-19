'use client';

import { useSession } from '@hikka/react';
import { Settings } from 'lucide-react';

import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import { LoginButton } from '@/features/common';

import { Link } from '@/utils/navigation';

const SidebarProfile = () => {
    const { user } = useSession();

    if (!user) {
        return (
            <Card className="bg-secondary/20 items-center">
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
        <Card className="bg-secondary/20 hidden items-center backdrop-blur-lg xl:flex">
            <div className="flex w-full items-center justify-between gap-2">
                <Link to={`/u/${user.username}`}>
                    <Avatar className="size-12 rounded-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="rounded-lg">
                            {user.username[0]}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex gap-2">
                    <Button variant="secondary" size="icon-md" asChild>
                        <Link to="/settings">
                            <Settings />
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon-md"
                        onClick={() => {
                            window.location.href = `/api/auth/logout?callbackUrl=${encodeURIComponent(window.location.href)}`;
                        }}
                    >
                        <MaterialSymbolsLogoutRounded />
                    </Button>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <Link
                    to={`/u/${user.username}`}
                    className="text-sm font-bold hover:underline"
                >
                    {user.username}
                </Link>
            </div>
        </Card>
    );
};

export default SidebarProfile;
