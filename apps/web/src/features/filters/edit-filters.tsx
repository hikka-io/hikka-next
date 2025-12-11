'use client';

import { ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import ContentType from '@/features/filters/components/prebuilt/content-type';
import EditStatus from '@/features/filters/components/prebuilt/edit-status';
import Sort from '@/features/filters/components/prebuilt/sort';
import User from '@/features/filters/components/prebuilt/user';

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
        <ScrollArea
            className={cn(
                'flex h-full flex-col lg:max-h-[calc(100vh-6rem)]',
                className,
            )}
        >
            <div className="mt-4 flex flex-col md:mt-0">
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
            <Button
                variant="secondary"
                className="my-4 w-full md:mt-4 lg:flex"
                onClick={clearFilters}
                asChild
            >
                <Link href="/edit">
                    <AntDesignClearOutlined /> Очистити
                </Link>
            </Button>
        </ScrollArea>
    );
};

export default EditFilters;
