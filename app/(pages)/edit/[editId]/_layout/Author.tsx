'use client';

import { format } from 'date-fns';
import * as React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import BaseCard from '@/app/_components/BaseCard';
import SubHeader from '@/app/_components/SubHeader';

const Component = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const edit: Hikka.Edit | undefined = queryClient.getQueryData([
        'edit',
        params.editId,
    ]);

    if (!edit) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            <p className="label-text">Автор</p>
            <div className="flex w-full items-center gap-4">
                <div className="w-12">
                    <BaseCard
                        href={'/u/' + edit.author.username}
                        containerClassName="!pt-[100%]"
                        poster={edit.author.avatar}
                    />
                </div>
                <div className="flex flex-1 flex-col">
                    <Link href={'/u/' + edit.author.username}>
                        <h5>{edit.author.username}</h5>
                    </Link>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            <p className="label-text-alt opacity-60">
                                {format(
                                    edit.created * 1000,
                                    'd MMM yyyy kk:mm',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
