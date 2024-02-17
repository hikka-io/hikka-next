'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import * as React from 'react';
import MaterialSymbolsShieldRounded from '~icons/material-symbols/shield-rounded';

import Link, { LinkProps } from 'next/link';

import { EDIT_STATUS } from '@/utils/constants';

import { Avatar, AvatarFallback, AvatarImage } from '../../../../ui/avatar';

interface Props extends LinkProps {
    edit: Hikka.Edit;
}

const Component = ({ edit, href, ...props }: Props) => {
    return (
        <Link
            {...props}
            href={href}
            className={clsx(
                'flex w-full items-center gap-4 px-8 py-4',
                edit.author
                    ? 'hover:cursor-pointer hover:bg-muted'
                    : 'pointer-events-none',
            )}
        >
            <Avatar className="rounded-md w-12 h-12">
                <AvatarImage
                    src={edit.author?.avatar}
                    className="rounded-md"
                    alt="avatar"
                />
                <AvatarFallback className="rounded-md">
                    <MaterialSymbolsShieldRounded className="text-xl flex-1 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col w-full overflow-hidden">
                {edit.author ? (
                    <h5 className="truncate min-w-0">{edit.author.username}</h5>
                ) : (
                    <h5 className="text-muted-foreground truncate min-w-0">
                        Системна правка
                    </h5>
                )}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-muted-foreground">
                            {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="whitespace-nowrap rounded-md px-2"
                style={{
                    backgroundColor: EDIT_STATUS[edit.status].color,
                }}
            >
                <p className="text-sm text-white">
                    {EDIT_STATUS[edit.status as Hikka.EditStatus].title_ua}
                </p>
            </div>
        </Link>
    );
};

export default Component;