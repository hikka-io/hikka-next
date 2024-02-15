import React from 'react';

import NotificationsMenu from './_components/notifications-menu/notifications-menu';
import ProfileMenu from './_components/profile-menu';

const Component = () => {
    return (
        <div className="flex gap-4 items-center">
            <NotificationsMenu />
            <ProfileMenu />
        </div>
    );
};

export default Component;
