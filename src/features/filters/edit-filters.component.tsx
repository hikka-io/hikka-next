'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/utils/utils';

import ContentType from './prebuilt/content-type';
import EditAuthor from './prebuilt/edit-author';
import EditModerator from './prebuilt/edit-moderator';
import EditStatus from './prebuilt/edit-status';
import Sort from './prebuilt/sort';

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
                        'anime',
                        'manga',
                        'novel',
                        'character',
                        'person',
                    ]}
                />

                <EditAuthor />
                <EditModerator />
            </div>
            <Button
                variant="secondary"
                className="my-4 w-full shadow-md md:mt-4 lg:flex"
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
