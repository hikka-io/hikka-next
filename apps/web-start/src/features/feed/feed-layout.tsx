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
                'lg:grid-cols-[1fr_20rem] xl:grid-cols-[20rem_1fr_20rem]',
                className,
            )}
        >
            <aside className="sticky top-20 hidden h-fit xl:block">
                <FeedSidebar />
            </aside>

            <main className="order-2 flex min-w-0 flex-col gap-4 lg:order-1">
                {children}
            </main>

            <aside className="order-1 block h-fit lg:order-2 xl:hidden">
                <FeedCombinedSidebar />
            </aside>

            <aside className="hidden h-fit xl:order-2 xl:block">
                <FeedWidgets />
            </aside>
        </div>
    );
};

export default FeedLayout;
