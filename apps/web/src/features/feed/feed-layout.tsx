'use client';

import { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import FeedSidebar from './feed-sidebar';
import FeedCombinedSidebar from './feed-sidebar/components/feed-combined-sidebar';
import SidebarContent from './feed-sidebar/components/sidebar-content';
import FeedWidgets from './feed-widgets';
import FeedMobileWidgets from './feed-widgets/components/feed-mobile-widgets';

interface Props {
    children: ReactNode;
    className?: string;
}

const FeedLayout: FC<Props> = ({ children, className }) => {
    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-8',
                'md:grid-cols-[1fr_19rem] xl:grid-cols-[19rem_1fr_19rem]',
                className,
            )}
        >
            <aside className="sticky top-20 hidden h-fit xl:block">
                <FeedSidebar />
            </aside>

            <main className="flex min-w-0 flex-col gap-4">
                <div className="flex flex-col gap-4 md:hidden">
                    <SidebarContent />
                    <FeedMobileWidgets />
                </div>
                {children}
            </main>

            <aside className="sticky top-20 hidden h-fit md:block xl:hidden">
                <FeedCombinedSidebar />
            </aside>

            <aside className="sticky top-20 hidden h-fit xl:block">
                <FeedWidgets />
            </aside>
        </div>
    );
};

export default FeedLayout;
