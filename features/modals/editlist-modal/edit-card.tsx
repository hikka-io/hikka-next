'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import Link, { LinkProps } from 'next/link';
import MaterialSymbolsShieldRounded from '~icons/material-symbols/shield-rounded';

import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import Small from '@/components/typography/small';

import { EDIT_STATUS } from '@/utils/constants';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '../../../components/ui/avatar';

interface Props extends LinkProps {
    edit: API.Edit;
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
            <Avatar className="size-12 rounded-md">
                <AvatarImage
                    src={edit.author?.avatar}
                    className="rounded-md"
                    alt="avatar"
                />
                <AvatarFallback className="rounded-md">
                    <MaterialSymbolsShieldRounded className="flex-1 text-xl text-muted-foreground" />
                </AvatarFallback>
            </Avatar>

            <div className="flex w-full flex-1 flex-col overflow-hidden">
                {edit.author ? (
                    <H5 className="min-w-0 truncate">{edit.author.username}</H5>
                ) : (
                    <H5 className="min-w-0 truncate text-muted-foreground">
                        Системна правка
                    </H5>
                )}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <Small className="text-muted-foreground">
                            {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                        </Small>
                    </div>
                </div>
            </div>
            <div
                className="whitespace-nowrap rounded-sm px-2"
                style={{
                    backgroundColor: EDIT_STATUS[edit.status].color,
                }}
            >
                <P className="text-sm text-white">
                    {EDIT_STATUS[edit.status as API.EditStatus].title_ua}
                </P>
            </div>
        </Link>
    );
};

export default Component;
