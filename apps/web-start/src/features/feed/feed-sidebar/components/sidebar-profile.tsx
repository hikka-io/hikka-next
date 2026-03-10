'use client';

import { useSession } from '@hikka/react';
import { Settings } from 'lucide-react';
import { Link } from '@/utils/navigation';

import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import { LoginButton } from '@/features/common';

const SidebarProfile = () => {
    const { user } = useSession();

    if (!user) {
        return (
            <Card className="items-center bg-secondary/20">
                <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm font-bold">Приєднуйся до hikka</p>
                    <p className="text-xs text-muted-foreground">
                        Відслідковуй свій прогрес, створюй власні колекції та веди обговорення зі спільнотою
                    </p>
                </div>
                <LoginButton className="w-full" variant="secondary" />
            </Card>
        );
    }

    return (
        <Card className="items-center bg-secondary/20 backdrop-blur">
            <div className="flex items-center justify-between gap-2 w-full">
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
                    <Button variant="destructive" size="icon-md" asChild>
                        <Link to={`/u/${user.username}`}>
                            <MaterialSymbolsLogoutRounded />
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
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
