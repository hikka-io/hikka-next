'use client';

import { format } from 'date-fns';
import * as React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import BaseCard from '@/app/_components/BaseCard';
import getEdit from '@/utils/api/edit/getEdit';


const Component = () => {
    const params = useParams();

    const { data: edit } = useQuery({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) })
    });

    if (!edit || !edit.moderator) {
        return null;
    }

    return (
        <>
            <div className="divider" />
            <div className="flex flex-col gap-2">
                <p className="label-text">Модератор</p>
                <div className="flex w-full items-center gap-4">
                    <div className="w-12">
                        <BaseCard
                            href={'/u/' + edit.moderator.username}
                            containerClassName="!pt-[100%]"
                            poster={edit.moderator.avatar}
                        />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <Link href={'/u/' + edit.moderator.username}>
                            <h5>{edit.moderator.username}</h5>
                        </Link>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4">
                                <p className="label-text-alt opacity-60">
                                    {format(
                                        edit.updated * 1000,
                                        'd MMM yyyy kk:mm',
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