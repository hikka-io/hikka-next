'use client';

import { useUserByUsername } from '@hikka/react';

import MaterialSymbolsSecurity from '@/components/icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '@/components/icons/material-symbols/MaterialSymbolsShieldPerson';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { Link, useParams } from '@/utils/navigation';

const UserTitle = () => {
    const params = useParams();
    const { data: user } = useUserByUsername({
        username: String(params.username),
    });

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
                <Link to={`/u/${user.username}`}>
                    <h3 className="line-clamp-1 break-all hover:underline">
                        {user.username}
                    </h3>
                </Link>
                {(user.role === 'admin' || user.role === 'moderator') && (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="border-border bg-secondary/20 rounded-sm border p-1 text-xs font-bold backdrop-blur">
                                {user.role === 'admin' && (
                                    <MaterialSymbolsSecurity className="text-[#d0bfff]" />
                                )}
                                {user.role === 'moderator' && (
                                    <MaterialSymbolsShieldPerson className="text-[#ffc9c9]" />
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm">
                                {user.role === 'admin'
                                    ? 'Адміністратор'
                                    : 'Модератор'}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            {user.description && (
                <MDViewer className="text-muted-foreground line-clamp-3 text-sm leading-5">
                    {user.description}
                </MDViewer>
            )}
        </div>
    );
};

export default UserTitle;
