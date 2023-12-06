'use client';

import * as React from 'react';
import BaseCard from '@/app/_components/BaseCard';
import { EDIT_STATUS } from '@/utils/constants';
import { format } from 'date-fns';
import Link, { LinkProps } from 'next/link';

interface Props extends LinkProps {
    edit: Hikka.Edit;
}

const Component = ({ edit, href, ...props }: Props) => {
    return (
        <Link
            {...props}
            href={href}
            className="w-full flex gap-4 px-8 py-4 items-center hover:bg-secondary/60 hover:cursor-pointer"
        >
            <div className="w-12">
                <BaseCard
                    containerClassName="!pt-[100%]"
                    poster={edit.author.avatar}
                />
            </div>
            <div className="flex flex-col flex-1">
                <h5>{edit.author.username}</h5>
                <div className="flex flex-col gap-1">
                    <div className="flex gap-4 items-center">
                        <p className="label-text-alt opacity-60">
                            {format(edit.created * 1000, 'd MMM yyyy kk:mm')}
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="rounded-md whitespace-nowrap px-2"
                style={{
                    backgroundColor: EDIT_STATUS[edit.status].color,
                }}
            >
                <p className="label-text !text-white">{EDIT_STATUS[edit.status as Hikka.EditStatus].title_ua}</p>
            </div>
        </Link>
    );
};

export default Component;
