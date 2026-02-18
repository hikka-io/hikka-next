'use client';

import { ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import ContentType from '@/components/filters/content-type';
import EditStatus from '@/components/filters/edit-status';
import Sort from '@/components/filters/sort';
import User from '@/components/filters/user';
import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

interface Props {
    className?: string;
}

const EditFilters: FC<Props> = ({ className }) => {
    const router = useRouter();
    const pathname = usePathname();

    const clearFilters = () => {
        router.replace(`${pathname}`);
    };

    return (
        <div className={cn('flex flex-col w-full', className)}>
            <div className="flex flex-col gap-8 overflow-y-auto p-4 py-8">
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

export default EditFilters;
