import Link from 'next/link';
import * as React from 'react';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';

interface Props {
    href: string;
    poster: string;
    title: string;
}

const General: FC<Props> = ({ href, title, poster }) => {
    return (
        <>
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <ContentCard href={href} poster={poster} />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <ContentCard href={href} poster={poster} />
                </div>
                <Link href={href}>{title}</Link>
            </div>
        </>
    );
};

export default General;
