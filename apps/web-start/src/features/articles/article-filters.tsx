'use client';

import { useSession } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

import ArticleCategory from '@/features/filters/article-category';
import ArticleCustomization from '@/features/filters/article-customization';
import Sort from '@/features/filters/sort';
import Tag from '@/features/filters/tag';
import User from '@/features/filters/user';

import { cn } from '@/utils/cn';

interface Props {
    className?: string;
}

const ArticleFilters: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const router = useRouter();

    const clearFilters = () => {
        router.navigate({ search: {}, replace: true } as any);
    };

    return (
        <div className={cn('flex w-full flex-col', className)}>
            <div className="flex flex-col gap-8 overflow-y-auto p-4 py-8">
                <ArticleCategory />
                <Sort sort_type="article" />
                <User title="Автор" paramKey="author" />
                <Tag />
                {user && <ArticleCustomization />}
            </div>
            <div className="bg-secondary/20 flex shrink-0 gap-2 border-t p-4">
                <Button
                    size="md"
                    className="w-full"
                    variant="destructive"
                    onClick={clearFilters}
                >
                    <AntDesignClearOutlined /> Очистити
                </Button>
            </div>
        </div>
    );
};

export default ArticleFilters;
