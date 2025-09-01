'use client';

import { useSession } from '@hikka/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

import {
    ArticleCategory,
    ArticleCustomization,
    Sort,
    Tag,
    User,
} from '@/features/filters';

import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const ArticleFilters: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const clearFilters = () => {
        router.replace(`${pathname}`);
    };

    return (
        <div
            className={cn(
                'no-scrollbar h-full overflow-x-scroll lg:max-h-[calc(100vh-6rem)]',
                className,
            )}
        >
            <div className="mt-4 flex flex-col md:mt-0">
                <ArticleCategory />
                <Sort sort_type="article" />
                <User title="Автор" paramKey="author" />
                <Tag />
                {user && <ArticleCustomization />}
            </div>
            <Button
                variant="secondary"
                className="my-4 w-full md:mt-4 lg:flex"
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
