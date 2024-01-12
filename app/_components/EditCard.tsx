'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import * as React from 'react';
import MaterialSymbolsShieldRounded from '~icons/material-symbols/shield-rounded';

import Link, { LinkProps } from 'next/link';

import BaseCard from '@/app/_components/BaseCard';
import { EDIT_STATUS } from '@/utils/constants';

interface Props extends LinkProps {
    edit: Hikka.Edit;
}

const Component = ({ edit, href, ...props }: Props) => {
    return (
        <Link
            {...props}
            href={href}
            className={clsx(
                'flex w-full items-center gap-4 px-8 py-4',
                edit.author
                    ? 'hover:cursor-pointer hover:bg-secondary/60'
                    : 'pointer-events-none',
            )}
        >
            <div className="w-12">
                <BaseCard
                    containerClassName="!pt-[100%]"
                    poster={
                        edit.author ? (
                            edit.author.avatar
                        ) : (
                            <MaterialSymbolsShieldRounded className="text-xl flex-1 text-neutral" />
                        )
                    }
                />
            </div>
            <div className="flex flex-1 flex-col">
                {edit.author ? (
                    <h5>{edit.author.username}</h5>
                ) : (
                    <h5 className="text-neutral">Системна правка</h5>
                )}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <p className="label-text-alt opacity-60">
                            {format(edit.created * 1000, 'd MMM yyyy kk:mm')}
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="whitespace-nowrap rounded-md px-2"
                style={{
                    backgroundColor: EDIT_STATUS[edit.status].color,
                }}
            >
                <p className="label-text !text-white">
                    {EDIT_STATUS[edit.status as Hikka.EditStatus].title_ua}
                </p>
            </div>
        </Link>
    );
};

export default Component;