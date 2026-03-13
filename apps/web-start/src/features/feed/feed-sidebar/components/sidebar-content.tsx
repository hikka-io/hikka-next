'use client';

import SidebarContentStats from './sidebar-content-stats';
import SidebarNavigation from './sidebar-navigation';
import SidebarProfile from './sidebar-profile';

const SidebarContent = () => {
    return (
        <div className="flex flex-col gap-4">
            <SidebarProfile />
            <SidebarNavigation />
            <SidebarContentStats />
        </div>
    );
};

export default SidebarContent;
