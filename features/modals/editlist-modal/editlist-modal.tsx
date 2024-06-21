'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import EditCard from '@/features/modals/editlist-modal/edit-card';

import getEditList from '@/services/api/edit/getEditList';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { cn } from '@/utils/utils';

interface Props {
    content_type: API.ContentType;
    slug: string;
}

const Component = ({ content_type, slug }: Props) => {
    const { ref, inView } = useInView();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteList({
            queryKey: ['editList', slug, content_type],
            queryFn: ({ pageParam }) =>
                getEditList({
                    params: {
                        slug: slug,
                        content_type: content_type,
                    },
                    page: pageParam,
                }),
        });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    if (!list) {
        return null;
    }

    return (
        <>
            <div className={cn('relative py-4 px-6')}>
                <Button variant="secondary" className="w-full" asChild>
                    <Link
                        href={`/edit/new?slug=${slug}&content_type=${content_type}`}
                    >
                        Створити правку
                    </Link>
                </Button>
            </div>
            <Separator />
            {list!.length > 0 && (
                <div className="h-full w-auto flex-1 overflow-y-scroll">
                    {list!.map((edit) => (
                        <EditCard
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
