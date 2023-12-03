'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import * as React from 'react';
import BaseCard from '@/app/_components/BaseCard';
import { format } from 'date-fns';
import Link from 'next/link';

const Component = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const edit: Hikka.Edit | undefined = queryClient.getQueryData([
        'edit',
        params.editId,
    ]);

    if (!edit || !edit.moderator) {
        return null;
    }

    return (
        <>
            <div className="divider" />
            <div className="flex flex-col gap-2">
                <p className="label-text">Модератор</p>
                <div className="w-full flex gap-4 items-center">
                    <div className="w-12">
                        <BaseCard
                            href={'/u/' + edit.moderator.username}
                            containerClassName="!pt-[100%]"
                            poster={edit.moderator.avatar}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <Link href={'/u/' + edit.moderator.username}>
                            <h5>{edit.moderator.username}</h5>
                        </Link>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-4 items-center">
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
