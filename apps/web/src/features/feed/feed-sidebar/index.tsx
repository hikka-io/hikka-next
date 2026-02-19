'use client';

import SidebarContentStats from './components/sidebar-content-stats';
import SidebarNavigation from './components/sidebar-navigation';
import SidebarProfile from './components/sidebar-profile';

const FeedSidebar = () => {
    return (
        <div className="flex flex-col gap-4">
            <SidebarProfile />
            <SidebarNavigation />
            <SidebarContentStats />
        </div>
    );
};

export default FeedSidebar;
