'use client';

import { useSession } from '@hikka/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

import ArticleCategory from '@/features/filters/components/prebuilt/article-category';
import ArticleCustomization from '@/features/filters/components/prebuilt/article-customization';
import Sort from '@/features/filters/components/prebuilt/sort';
import Tag from '@/features/filters/components/prebuilt/tag';
import User from '@/features/filters/components/prebuilt/user';

import { cn } from '@/utils/cn';

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
        <div className={cn('flex flex-col w-full', className)}>
            <div className="flex flex-col gap-8 overflow-y-auto p-4 py-8">
                <ArticleCategory />
                <Sort sort_type="article" />
                <User title="Автор" paramKey="author" />
                <Tag />
                {user && <ArticleCustomization />}
            </div>
            <div className="flex shrink-0 gap-2 border-t border-secondary/60 bg-secondary/30 p-4">
                <Button
                    size="md"
                    className="w-full"
                    variant="destructive"
                    onClick={clearFilters}
                    asChild
                >
                    <Link href={pathname}>
                        <AntDesignClearOutlined /> Очистити
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default ArticleFilters;
