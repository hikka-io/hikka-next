import React from 'react';

import NotificationsMenu from './notifications-menu';
import ProfileMenu from './profile-menu';

const Component = () => {
    return (
        <div className="flex items-center gap-4">
            <NotificationsMenu />
            <ProfileMenu />
        </div>
    );
};

export default Component;
