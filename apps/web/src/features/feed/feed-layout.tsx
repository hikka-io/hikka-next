'use client';

import { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    sidebar?: ReactNode;
    widgets?: ReactNode;
    children: ReactNode;
    className?: string;
}

const FeedLayout: FC<Props> = ({ sidebar, widgets, children, className }) => {
    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-8 md:grid-cols-[1fr_25%] xl:grid-cols-[20%_1fr_25%]',
                className,
            )}
        >
            {sidebar && (
                <aside className="sticky top-20 hidden h-fit xl:block">
                    {sidebar}
                </aside>
            )}
            <main className="min-w-0">{children}</main>
            {widgets && (
                <aside className="sticky top-20 hidden h-fit lg:block">
                    {widgets}
                </aside>
            )}
        </div>
    );
};

export default FeedLayout;
