import { listUserClientsInfiniteOptions } from '@hikka/api';

import MaterialSymbolsAppsRounded from '@/components/icons/material-symbols/MaterialSymbolsAppsRounded';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import ApplicationItem from './components/application-item';

const ClientApps = () => {
    const { list } = useInfiniteList(listUserClientsInfiniteOptions());

    if (!list || list.length === 0) {
        return (
            <EmptyState
                bordered
                icon={<MaterialSymbolsAppsRounded />}
                title="Не знайдено застосунків"
                description="Створіть свій перший застосунок для сторонньої авторизації"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {list.map((item) => (
                <ApplicationItem key={item.reference} client={item} />
            ))}
        </div>
    );
};

export default ClientApps;
