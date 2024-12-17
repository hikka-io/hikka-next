'use client';

import { format } from 'date-fns/format';
import Link from 'next/link';
import * as React from 'react';

import ContentCard from '@/components/content-card/content-card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { USER_ROLE } from '@/utils/constants/common';

interface Props {
    user: API.User;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const UserCard = ({ user, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            href={'/u/' + user.username}
            onClick={onClick}
            className="flex w-full gap-4 text-left"
        >
            <div className="w-12 sm:w-16">
                <ContentCard image={user.avatar} containerRatio={1} />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {user.username}
                    </Label>

                    {user.active && (
                        <div className="-bottom-2 -right-2 z-[1] size-2 rounded-full border border-secondary bg-success" />
                    )}

                    {(user.role === 'admin' || user.role === 'moderator') && (
                        <>
                            <Badge
                                className="text-xs"
                                variant="status"
                                bgColor={USER_ROLE[user.role].color}
                            >
                                {USER_ROLE[user.role].label}
                            </Badge>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">
                            {format(
                                new Date(user.created * 1000),
                                'd MMMM yyyy',
                            )}
                        </Label>
                    </div>
                </div>
            </div>
        </Comp>
    );
};

export default UserCard;
