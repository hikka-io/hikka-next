'use client';

import { EditResponse } from '@hikka/client';
import { addTitleProperty } from '@hikka/react/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import Small from '@/components/typography/small';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { EDIT_PARAMS, EDIT_STATUS } from '@/utils/constants/edit';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { cn } from '@/utils/utils';

interface Props {
    edit: EditResponse;
}

const EditRow: FC<Props> = ({ edit }) => {
    const router = useRouter();
    const content = addTitleProperty(edit.content, 'title_ua');

    return (
        <TableRow
            key={edit.edit_id}
            className={cn('hover:cursor-pointer')}
            onClick={() => router.push(`/edit/${edit.edit_id}`)}
        >
            <TableCell className="hidden w-8 sm:table-cell">
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
                        {content.title}
                    </Link>
                </div>
                <Label className="text-muted-foreground text-xs">
                    {CONTENT_TYPES[edit.content_type].title_ua}
                </Label>
            </TableCell>
            <TableCell className="hidden sm:table-cell" align="left">
                <div className="flex flex-wrap gap-2">
                    {Object.keys(edit.after).map((key, index) => (
                        <Badge variant="outline" key={key}>
                            {EDIT_PARAMS[key as keyof typeof EDIT_PARAMS]}
                        </Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell align="center" className="w-20">
                <div className="flex justify-end">
                    <Badge
                        className="size-2 p-0 md:size-auto md:px-1.5"
                        variant="status"
                        bgColor={EDIT_STATUS[edit.status].color}
                    >
                        <span className="hidden md:block">
                            {EDIT_STATUS[edit.status].title_ua}
                        </span>
                    </Badge>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default EditRow;
