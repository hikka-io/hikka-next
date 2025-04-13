'use client';

import NotFound from '../../../components/ui/not-found';
import useClients from '../../../services/hooks/client/use-clients';
import ApplicationItem from './application-item';

const Component = () => {
    const { data } = useClients();

    return (
        <div className="flex w-full flex-col gap-6">
            {data && data.list.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {data?.list?.map((item) => (
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

export default Component;
