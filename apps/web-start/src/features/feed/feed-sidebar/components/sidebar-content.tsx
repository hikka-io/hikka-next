'use client';

import { useSession } from '@hikka/react';

import SidebarContentStats from './sidebar-content-stats';
import SidebarNavigation from './sidebar-navigation';
import SidebarProfile from './sidebar-profile';

const SidebarContent = () => {
    const { user } = useSession();

    return (
        <div className="flex flex-col gap-4">
            <SidebarProfile />
            <SidebarNavigation />
            {user && <SidebarContentStats />}
        </div>
    );
};

export default SidebarContent;
