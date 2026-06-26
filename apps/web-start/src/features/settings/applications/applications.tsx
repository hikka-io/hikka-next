import { listUserClientsInfiniteOptions } from '@hikka/api';

import NotFound from '@/components/ui/not-found';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import ApplicationItem from './components/application-item';

const ApplicationsSettings = () => {
    const { list } = useInfiniteList(listUserClientsInfiniteOptions());

    return (
        <div className="flex w-full flex-col gap-6">
            {list && list.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {list?.map((item) => (
                        <ApplicationItem key={item.reference} client={item} />
                    ))}
                </div>
            ) : (
                <NotFound
                    title="Не знайдено застосунків"
                    description="Створіть свій перший застосунок для сторонньої авторизації"
                />
            )}
        </div>
    );
};

export default ApplicationsSettings;
