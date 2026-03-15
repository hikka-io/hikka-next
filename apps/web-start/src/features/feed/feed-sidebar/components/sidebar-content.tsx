'use client';

import SidebarContentStats from './sidebar-content-stats';
import SidebarProfile from './sidebar-profile';

const SidebarContent = () => {
    return (
        <div className="flex flex-col gap-6">
            <SidebarProfile />
            <SidebarContentStats />
        </div>
    );
};

export default SidebarContent;
