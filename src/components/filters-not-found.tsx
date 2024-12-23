'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';

import AntDesignClearOutlined from './icons/ant-design/AntDesignClearOutlined';

const FiltersNotFound = () => {
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

export default FiltersNotFound;
