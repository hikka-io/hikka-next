import { useState } from 'react';

import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/utils/navigation';

import { useProfileMenu } from '../hooks/use-profile-menu';
import ProfileIdentity from './profile-identity';

const ProfileMenu = () => {
    const [open, setOpen] = useState(false);
    const { user, items, logout } = useProfileMenu({ enabled: open });

    if (!user) {
        return null;
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="md"
                    className="relative size-10 rounded-md"
                >
                    <Avatar className="rounded-md">
                        <AvatarImage
                            src={user.avatar}
                            className="rounded-md"
                            alt="avatar"
                        />
                        <AvatarFallback className="rounded-md">
                            {user.username[0]}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 p-2">
                <ProfileIdentity
                    user={user}
                    onNavigate={() => setOpen(false)}
                    className="mb-2"
                />

                <DropdownMenuLabel className="flex h-8 items-center">
                    Профіль
                </DropdownMenuLabel>

                {items.map((item) => (
                    <DropdownMenuItem key={item.slug} className="p-2" asChild>
                        <Link to={item.url} search={item.search}>
                            {item.icon && <item.icon className="size-4" />}
                            {item.title_ua}
                            {item.count !== undefined && (
                                <span className="ml-auto text-muted-foreground text-xs tabular-nums">
                                    {item.count}
                                </span>
                            )}
                        </Link>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout} className="p-2">
                    <MaterialSymbolsLogoutRounded className="text-destructive-foreground" />
                    Вийти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
