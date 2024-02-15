'use client';

import React from 'react';
import ClarityAdministratorSolid from '~icons/clarity/administrator-solid';

import { useParams } from 'next/navigation';

import { useUser } from '@/app/(pages)/u/[username]/page.hooks';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {}

const Component = ({}: Props) => {
    const params = useParams();
    const { data: user } = useUser(String(params.username));

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex gap-2 items-center">
                <h3 className="overflow-hidden overflow-ellipsis">
                    {user.username}
                </h3>
                {(user.role === 'admin' || user.role === 'moderator') && (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="rounded-md bg-secondary/30 border border-secondary/60 backdrop-blur p-1 text-xs font-bold text-secondary-foreground">
                                <ClarityAdministratorSolid />
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
                {user.active && <Badge variant="success">Онлайн</Badge>}
            </div>
            {user.description && (
                <p className="text-sm text-muted-foreground">
                    {user.description}
                </p>
            )}
        </div>
    );
};

export default Component;