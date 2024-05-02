'use client';

import { format } from 'date-fns';
import * as React from 'react';
import { FC } from 'react';

import Link from 'next/link';

import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import useEdit from '@/services/hooks/edit/useEdit';

interface Props {
    editId: string;
}

const Moderator: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ editId: Number(editId) });

    if (!edit || !edit.moderator) {
        return null;
    }

    return (
        <>
            <hr className="my-4 h-px w-full text-muted-foreground" />
            <div className="flex flex-col gap-4">
                <Label className="text-muted-foreground">Модератор</Label>
                <div className="flex w-full items-center gap-4">
                    <Link href={`/u/${edit.moderator.username}`}>
                        <Avatar className="size-12 rounded-md">
                            <AvatarImage
                                className="rounded-md"
                                src={edit.moderator.avatar}
                                alt={edit.moderator.username}
                            />
                            <AvatarFallback className="rounded-md">
                                {edit.moderator.username[0]}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-1 flex-col">
                        <Link href={'/u/' + edit.moderator.username}>
                            <H5>{edit.moderator.username}</H5>
                        </Link>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4">
                                <Small className="text-muted-foreground">
                                    {format(
                                        edit.updated * 1000,
                                        'd MMM yyyy H:mm',
                                    )}
                                </Small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Moderator;
