import type { FC } from 'react';

import MaterialSymbolsNotificationsRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationsRounded';
import EmptyState from '@/components/ui/empty-state';

const NotFoundNotifications: FC = () => {
    return (
        <EmptyState
            size="sm"
            icon={<MaterialSymbolsNotificationsRounded />}
            title="Сповіщень не знайдено"
            description="Тут будуть відображатись майбутні сповіщення"
        />
    );
};

export default NotFoundNotifications;
