import React from 'react';

import NotificationsMenu from '@/components/navbar/components/profile-navbar/components/notifications-menu';
import ProfileMenu from '@/components/navbar/components/profile-navbar/components/profile-menu';

const Component = () => {
    return (
        <div className="flex items-center gap-4">
            <NotificationsMenu />
            <ProfileMenu />
        </div>
    );
};

export default Component;
