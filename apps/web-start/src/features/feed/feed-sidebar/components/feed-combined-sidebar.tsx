'use client';

import WidgetSection from '../../feed-widgets/components/widget-section';
import SidebarProfile from './sidebar-profile';

const FeedCombinedSidebar = () => {
    return (
        <div className="flex flex-col gap-4 lg:max-h-[calc(100vh-9rem)]">
            <SidebarProfile />
            <WidgetSection />
        </div>
    );
};

export default FeedCombinedSidebar;
