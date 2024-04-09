'use client';

import * as React from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';

const Component = () => {
    const pathname = usePathname();

    return (
        <NotFound
            title="Не знайдено результатів за Вашим запитом"
            description="Очистіть або змініть фільтри, щоб отримати інший результат"
        >
            <Button variant="destructive" className="w-full lg:w-auto" asChild>
                <Link href={pathname}>
                    <AntDesignClearOutlined />
                    Очистити
                </Link>
            </Button>
        </NotFound>
    );
};

export default Component;
