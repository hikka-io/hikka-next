'use client';

import React from 'react';
import ClarityAdministratorSolid from '~icons/clarity/administrator-solid';

import { useParams } from 'next/navigation';

import H3 from '@/components/typography/h3';
import P from '@/components/typography/p';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import useUser from '@/services/hooks/user/useUser';

interface Props {}

const Component = ({}: Props) => {
    const params = useParams();
    const { data: user } = useUser({ username: String(params.username) });

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
                <H3 className="overflow-hidden text-ellipsis">
                    {user.username}
                </H3>
                {(user.role === 'admin' || user.role === 'moderator') && (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="rounded-md border border-secondary/60 bg-secondary/30 p-1 text-xs font-bold text-secondary-foreground backdrop-blur">
                                <ClarityAdministratorSolid />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <P className="text-sm">
                                {user.role === 'admin'
                                    ? 'Адміністратор'
                                    : 'Модератор'}
                            </P>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            {user.description && (
                <P className="text-sm text-muted-foreground">
                    {user.description}
                </P>
            )}
        </div>
    );
};

export default Component;
