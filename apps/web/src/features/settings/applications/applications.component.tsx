'use client';

import { useAllClients } from '@hikka/react';

import NotFound from '@/components/ui/not-found';

import ApplicationItem from './application-item';

const Component = () => {
    const { list } = useAllClients();

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

export default Component;
