import MaterialSymbolsSearchRounded from '@/components/icons/material-symbols/MaterialSymbolsSearchRounded';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Link, usePathname } from '@/utils/navigation';

import AntDesignClearOutlined from './icons/ant-design/AntDesignClearOutlined';

const FiltersNotFound = () => {
    const pathname = usePathname();

    return (
        <EmptyState
            bordered
            icon={<MaterialSymbolsSearchRounded />}
            title="Не знайдено результатів за Вашим запитом"
            description="Очистіть або змініть фільтри, щоб отримати інший результат"
            action={
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
            }
        />
    );
};

export default FiltersNotFound;
