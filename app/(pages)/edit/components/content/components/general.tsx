import * as React from 'react';
import { FC } from 'react';

import Link from 'next/link';

import EntryCard from '@/components/entry-card/entry-card';

interface Props {
    href: string;
    poster: string;
    title: string;
}

const General: FC<Props> = ({ href, title, poster }) => {
    return (
        <>
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <EntryCard href={href} poster={poster} />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <EntryCard href={href} poster={poster} />
                </div>
                <Link href={href}>{title}</Link>
            </div>
        </>
    );
};

export default General;
