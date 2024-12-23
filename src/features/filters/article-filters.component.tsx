'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/utils';

import Sort from './prebuilt/sort';
import User from './prebuilt/user';

interface Props {
    className?: string;
}

const ArticleFilters: FC<Props> = ({ className }) => {
    const router = useRouter();
    const pathname = usePathname();

    const clearFilters = () => {
        router.replace(`${pathname}`);
    };

    return (
        <div
            className={cn(
                'h-full overflow-x-scroll no-scrollbar lg:max-h-[calc(100vh-6rem)]',
                className,
            )}
        >
            <div className="mt-4 flex flex-col md:mt-0">
                <Sort sort_type="article" />
                <User title="Автор" paramKey="author" />
            </div>
            <Button
                variant="secondary"
                className="my-4 w-full shadow-md md:mt-4 lg:flex"
                onClick={clearFilters}
                asChild
            >
                <Link href={pathname}>
                    <AntDesignClearOutlined /> Очистити
                </Link>
            </Button>
        </div>
    );
};

export default ArticleFilters;
