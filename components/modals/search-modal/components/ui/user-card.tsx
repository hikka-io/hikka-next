'use client';

import * as React from 'react';

import Link from 'next/link';
import format from 'date-fns/format';

import ContentCard from '@/components/content-card/content-card';
import { Label } from '@/components/ui/label';


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
                <ContentCard 
                    poster={user.avatar}
                    containerRatio={1}
                />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">

                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {user.username}
                    </Label>

                    {user.active && (
                        <div className="-bottom-2 -right-2 z-[1] size-2 rounded-full border-1 border-secondary bg-success" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">
                        {format(
                            new Date(user.created * 1000),
                            'd MMMM yyyy',
                        )}
                    </Label>
                </div>
            </div>
        </Comp>
    );
};

export default UserCard;
