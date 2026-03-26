'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

import ContentType from '@/features/filters/content-type';
import EditStatus from '@/features/filters/edit-status';
import Sort from '@/features/filters/sort';
import User from '@/features/filters/user';

import { cn } from '@/utils/cn';

interface Props {
    className?: string;
}

const EditFilters: FC<Props> = ({ className }) => {
    const router = useRouter();

    const clearFilters = () => {
        router.navigate({ search: {}, replace: true } as any);
    };

    return (
        <div
            className={cn(
                '-m-4 flex flex-1 flex-col lg:m-0 lg:w-full',
                className,
            )}
        >
            <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-4 py-8">
                <Sort sort_type="edit" />
                <EditStatus />
                <ContentType
                    contentTypes={[
                        ContentTypeEnum.ANIME,
                        ContentTypeEnum.MANGA,
                        ContentTypeEnum.NOVEL,
                        ContentTypeEnum.CHARACTER,
                        ContentTypeEnum.PERSON,
                    ]}
                />
                <User title="Автор" paramKey="author" />
                <User title="Модератор" paramKey="moderator" />
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

export default EditFilters;
