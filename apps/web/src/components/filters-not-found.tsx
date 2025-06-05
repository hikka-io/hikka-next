'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import AntDesignClearOutlined from './icons/ant-design/AntDesignClearOutlined';
import { Button } from './ui/button';
import NotFound from './ui/not-found';

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
