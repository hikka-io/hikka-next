'use client';

import { format } from 'date-fns';
import * as React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/app/_components/ui/avatar';
import { Label } from '@/app/_components/ui/label';
import getEdit from '@/utils/api/edit/getEdit';


const Component = () => {
    const params = useParams();

    const { data: edit } = useQuery({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) }),
    });

    if (!edit || !edit.moderator) {
        return null;
    }

    return (
        <>
            <hr className="h-[1px] text-muted-foreground w-full my-4" />
            <div className="flex flex-col gap-4">
                <Label className="text-muted-foreground">Модератор</Label>
                <div className="flex w-full items-center gap-4">
                    <Link href={`/u/${edit.moderator.username}`}>
                        <Avatar className="rounded-md w-12 h-12">
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
                            <h5>{edit.moderator.username}</h5>
                        </Link>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4">
                                <p className="text-xs text-muted-foreground">
                                    {format(
                                        edit.updated * 1000,
                                        'd MMM yyyy H:mm',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Component;