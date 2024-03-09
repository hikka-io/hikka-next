'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import BaseCard from '@/components/ui/base-card';
import { Label } from '@/components/ui/label';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { useSettingsContext } from '@/services/providers/settings-provider';
import {
    CONTENT_TYPE_LINKS,
    CONTENT_TYPE_TITLES,
    EDIT_STATUS,
} from '@/utils/constants';

interface Props {
    edit: API.Edit;
}

const Component = ({ edit }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const router = useRouter();

    return (
        <TableRow
            key={edit.edit_id}
            className={clsx('hover:cursor-pointer hover:bg-secondary/60')}
            onClick={() => router.push(`/edit/${edit.edit_id}`)}
        >
            <TableHead className="w-8">
                <Label>{edit.edit_id}</Label>
            </TableHead>
            <TableCell>
                <div className="flex gap-4">
                    <div className="w-10 h-10">
                        <BaseCard
                            containerClassName="!pt-[100%]"
                            poster={edit.author!.avatar}
                        />
                    </div>
                    <div className="flex flex-col">
                        <Link
                            className="hover:underline"
                            href={`/u/${edit.author!.username}`}
                        >
                            {edit.author!.username}
                        </Link>
                        <Small className="text-muted-foreground">
                            {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                        </Small>
                    </div>
                </div>
            </TableCell>
            <TableCell align="left" className="md:w-1/4">
                <div className="flex gap-4">
                    <Link
                        className="hover:underline"
                        href={`${CONTENT_TYPE_LINKS[edit.content_type]}/${
                            edit.content.slug
                        }`}
                    >
                        {'title_en' in edit.content
                            ? edit.content[titleLanguage!] ||
                              edit.content.title_ua ||
                              edit.content.title_en ||
                              edit.content.title_ja
                            : edit.content.name_ua || edit.content.name_en}
                    </Link>
                </div>
                <Label className="text-xs text-muted-foreground">
                    {CONTENT_TYPE_TITLES[edit.content_type]}
                </Label>
            </TableCell>
            <TableCell className="hidden lg:table-cell md:w-1/3" align="left">
                <P
                    className={clsx(
                        'text-sm overflow-hidden overflow-ellipsis break-all',
                        !edit.description && 'text-muted-foreground',
                    )}
                >
                    {edit.description ? edit.description : 'Немає опису правки'}
                </P>
            </TableCell>
            <TableCell align="center" className="w-20">
                <div className="flex justify-end">
                    <div
                        className="whitespace-nowrap rounded-md px-2"
                        style={{
                            backgroundColor: EDIT_STATUS[edit.status].color,
                        }}
                    >
                        <P className="text-sm">
                            {EDIT_STATUS[edit.status].title_ua}
                        </P>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default Component;
