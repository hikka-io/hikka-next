'use client';

import { EditContentType } from '@hikka/client';
import { useEditList } from '@hikka/react';
import Link from 'next/link';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';

import EditCard from './components/edit-card';

interface Props {
    content_type: EditContentType;
    slug: string;
}

const Component = ({ content_type, slug }: Props) => {
    const { ref, list, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useEditList({
            args: {
                slug: slug,
                content_type: content_type,
            },
        });

    if (!list) {
        return null;
    }

    return (
        <>
            <div className={cn('relative px-6 py-4')}>
                <Button variant="secondary" className="w-full" asChild>
                    <Link
                        href={`/edit/new?slug=${slug}&content_type=${content_type}`}
                    >
                        <MaterialSymbolsEditRounded />
                        Створити правку
                    </Link>
                </Button>
            </div>
            <Separator />
            {list!.length > 0 && (
                <div className="h-full w-auto flex-1 overflow-y-scroll">
                    {list!.map((edit) => (
                        <EditCard
                            className="px-6 py-4"
                            href={`/edit/` + edit.edit_id}
                            key={edit.edit_id}
                            edit={edit}
                        />
                    ))}
                    {hasNextPage && (
                        <div className="px-6 py-4">
                            <LoadMoreButton
                                isFetchingNextPage={isFetchingNextPage}
                                fetchNextPage={fetchNextPage}
                                ref={ref}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Component;
