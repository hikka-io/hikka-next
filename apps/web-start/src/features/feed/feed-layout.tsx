'use client';

import { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import FeedSidebar from './feed-sidebar';
import FeedCombinedSidebar from './feed-sidebar/components/feed-combined-sidebar';
import FeedWidgets from './feed-widgets';

interface Props {
    children: ReactNode;
    className?: string;
}

const FeedLayout: FC<Props> = ({ children, className }) => {
    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-8',
                'lg:grid-cols-[1fr_19rem] xl:grid-cols-[19rem_1fr_19rem]',
                className,
            )}
        >
            <aside className="sticky top-20 hidden h-fit xl:block">
                <FeedSidebar />
            </aside>

            <main className="flex min-w-0 flex-col gap-4 order-2 lg:order-1">
                {children}
            </main>

            <aside className="lg:sticky top-20 h-fit block xl:hidden order-1 lg:order-2">
                <FeedCombinedSidebar />
            </aside>

            <aside className="sticky top-20 hidden h-fit xl:block xl:order-2">
                <FeedWidgets />
            </aside>
        </div>
    );
};

export default FeedLayout;
