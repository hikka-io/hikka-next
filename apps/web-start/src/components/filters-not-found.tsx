'use client';

import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';

import { Link } from '@/utils/navigation';
import { usePathname } from '@/utils/navigation';

import AntDesignClearOutlined from './icons/ant-design/AntDesignClearOutlined';

const FiltersNotFound = () => {
    const pathname = usePathname();

    return (
        <NotFound
            title="Не знайдено результатів за Вашим запитом"
            description="Очистіть або змініть фільтри, щоб отримати інший результат"
        >
            <Button
                variant="destructive"
                size="md"
                className="w-full lg:w-auto"
                asChild
            >
                <Link to={pathname}>
                    <AntDesignClearOutlined />
                    Очистити
                </Link>
            </Button>
        </NotFound>
    );
};

export default FiltersNotFound;
