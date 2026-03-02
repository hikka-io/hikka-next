'use client';

import { FC, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import FeedCombinedSidebar from './feed-combined-sidebar';
import FeedMobileWidgets from './feed-mobile-widgets';
import FeedSidebar from './feed-sidebar';
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
                'md:grid-cols-[1fr_19rem] xl:grid-cols-[19rem_1fr_19rem]',
                className,
            )}
        >
            <aside className="sticky top-20 hidden h-fit xl:block">
                <FeedSidebar />
            </aside>

            <main className="flex min-w-0 flex-col gap-4">
                <div className="md:hidden">
                    <FeedMobileWidgets />
                </div>
                {children}
            </main>

            {/* MD/LG: combined sidebar with profile + nav + widgets + stats */}
            <aside className="sticky top-20 hidden h-fit md:block xl:hidden">
                <FeedCombinedSidebar />
            </aside>

            {/* XL: widgets-only column (sidebar is separate left column) */}
            <aside className="sticky top-20 hidden h-fit xl:block">
                <FeedWidgets />
            </aside>
        </div>
    );
};

export default FeedLayout;
