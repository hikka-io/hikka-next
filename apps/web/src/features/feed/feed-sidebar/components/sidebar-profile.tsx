'use client';

import { useSession } from '@hikka/react';
import { Settings } from 'lucide-react';
import Link from 'next/link';

import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

const SidebarProfile = () => {
    const { user } = useSession();

    if (!user) return null;

    return (
        <Card className="items-center bg-secondary/20">
            <div className="flex items-center justify-between gap-2 w-full">
                <Link href={`/u/${user.username}`}>
                    <Avatar className="size-12 rounded-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="rounded-lg">
                            {user.username[0]}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex gap-2">
                    <Button variant="secondary" size="icon-md" asChild>
                        <Link href="/settings">
                            <Settings />
                        </Link>
                    </Button>
                    <Button variant="destructive" size="icon-md" asChild>
                        <Link href={`/u/${user.username}`}>
                            <MaterialSymbolsLogoutRounded />
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <Link
                    href={`/u/${user.username}`}
                    className="text-sm font-bold hover:underline"
                >
                    {user.username}
                </Link>
                {user.description && (
                    <MDViewer className="text-xs text-muted-foreground line-clamp-2">
                        {user.description}
                    </MDViewer>
                )}
            </div>
        </Card>
    );
};

export default SidebarProfile;
