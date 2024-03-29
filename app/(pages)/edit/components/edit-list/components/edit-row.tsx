'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import { useSettingsContext } from '@/services/providers/settings-provider';
import {
    CONTENT_TYPES,
    CONTENT_TYPE_LINKS,
    EDIT_PARAMS,
    EDIT_STATUS,
} from '@/utils/constants';

interface Props {
    edit: API.Edit;
}

const EditRow = ({ edit }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const router = useRouter();

    return (
        <TableRow
            key={edit.edit_id}
            className={clsx('hover:cursor-pointer hover:bg-secondary/60')}
            onClick={() => router.push(`/edit/${edit.edit_id}`)}
        >
            <TableCell className="w-8">
                <Label>{edit.edit_id}</Label>
            </TableCell>
            <TableCell className="w-40">
                <div className="flex gap-4">
                    <Avatar className="size-10 rounded-md">
                        <AvatarImage src={edit.author!.avatar} />
                    </Avatar>
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
                        className="line-clamp-2 hover:underline"
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
                    {CONTENT_TYPES[edit.content_type].title_ua}
                </Label>
            </TableCell>
            <TableCell className="hidden md:w-1/3 lg:table-cell" align="left">
                <div className="flex flex-wrap gap-2">
                    {Object.keys(edit.after).map((key) => (
                        <Badge variant="outline" key={key}>
                            {EDIT_PARAMS[key as keyof typeof EDIT_PARAMS]}
                        </Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell align="center" className="w-20">
                <div className="flex justify-end">
                    <div
                        className="whitespace-nowrap rounded-sm px-2"
                        style={{
                            backgroundColor: EDIT_STATUS[edit.status].color,
                        }}
                    >
                        <P className="text-sm text-white">
                            {EDIT_STATUS[edit.status].title_ua}
                        </P>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default EditRow;
