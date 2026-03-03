'use client';

import { useRef } from 'react';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import WidgetSection from '../../feed-widgets/components/widget-section';
import SidebarContent from './sidebar-content';

const FeedCombinedSidebar = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(scrollRef);

    return (
        <div
            ref={scrollRef}
            className={cn(
                'flex flex-col gap-4 max-h-[calc(100vh-7rem)] overflow-auto no-scrollbar',
                gradientClassName,
            )}
        >
            <SidebarContent />
            <WidgetSection />
        </div>
    );
};

export default FeedCombinedSidebar;
