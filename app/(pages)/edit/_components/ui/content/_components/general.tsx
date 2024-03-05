import * as React from 'react';

import Link from 'next/link';

import BaseCard from '@/components/ui/base-card';

interface Props {
    href: string;
    poster: string;
    title: string;
}

const Component = ({ href, title, poster }: Props) => {
    return (
        <>
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <BaseCard href={href} poster={poster} />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <BaseCard href={href} poster={poster} />
                </div>
                <Link href={href}>{title}</Link>
            </div>
        </>
    );
};

export default Component;
