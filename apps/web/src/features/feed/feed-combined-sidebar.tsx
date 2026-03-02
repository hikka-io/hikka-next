'use client';

import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import SidebarContentStats from './feed-sidebar/components/sidebar-content-stats';
import SidebarNavigation from './feed-sidebar/components/sidebar-navigation';
import SidebarProfile from './feed-sidebar/components/sidebar-profile';
import WidgetList from './feed-widgets/components/widget-list';
import { useOpenWidgetSettings } from './hooks/use-open-widget-settings';

const FeedCombinedSidebar = () => {
    const { user } = useSession();
    const openSettingsModal = useOpenWidgetSettings();
    const scrollRef = useRef(null);
    const { gradientClassName } = useScrollGradientMask(scrollRef);

    return (
        <div
            ref={scrollRef}
            className={cn(
                'flex flex-col gap-4 max-h-[calc(100vh-7rem)] overflow-auto no-scrollbar',
                gradientClassName,
            )}
        >
            {user && <SidebarProfile />}
            <SidebarNavigation />
            {user && <SidebarContentStats />}

            <Button
                variant="outline"
                className="w-full shrink-0 text-muted-foreground"
                size="md"
                onClick={openSettingsModal}
            >
                <Settings2 />
                Налаштувати віджети
            </Button>
            <WidgetList />
        </div>
    );
};

export default FeedCombinedSidebar;
