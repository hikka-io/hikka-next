'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';

import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

import useEdit from '@/services/hooks/edit/useEdit';

interface Props {
    editId: string;
}

const EditAuthor: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ edit_id: Number(editId) });

    if (!edit) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <Label className="text-muted-foreground">Автор</Label>
            <div className="flex w-full items-center gap-4">
                <Link href={`/u/${edit.author!.username}`}>
                    <Avatar className="size-12 rounded-md">
                        <AvatarImage
                            className="rounded-md"
                            src={edit.author!.avatar}
                            alt={edit.author!.username}
                        />
                        <AvatarFallback className="rounded-md">
                            {edit.author!.username[0]}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-1 flex-col">
                    <Link href={'/u/' + edit.author!.username}>
                        <H5>{edit.author!.username}</H5>
                    </Link>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            <Small className="text-muted-foreground">
                                {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                            </Small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAuthor;
