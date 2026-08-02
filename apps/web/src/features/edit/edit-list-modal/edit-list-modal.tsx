import { Fragment } from 'react';

import { range } from '@antfu/utils';

import { type EditContentTypeEnum, getEditsInfiniteOptions } from '@hikka/api';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { Link } from '@/utils/navigation';

import { QuickEditButton } from '../quick-edit';
import EditCard from './components/edit-card';
import EditCardSkeleton from './components/edit-card-skeleton';

const SKELETON_COUNT = 5;

type Props = {
    content_type: EditContentTypeEnum;
    slug: string;
};

const EditListModal = ({ content_type, slug }: Props) => {
    const {
        ref,
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteList(
        getEditsInfiniteOptions({
            body: {
                slug: slug,
                content_type: content_type,
            },
        }),
    );

    return (
        <Fragment>
            {!isLoading && list?.length === 0 ? (
                <EmptyState
                    icon={<MaterialSymbolsEditRounded />}
                    title="Правок ще немає"
                    description="Станьте першим, хто запропонує правку для цього контенту"
                />
            ) : (
                <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
                    {isLoading &&
                        range(0, SKELETON_COUNT).map((index) => (
                            <EditCardSkeleton key={index} />
                        ))}
                    {list?.map((edit) => (
                        <EditCard
                            to={`/edit/${edit.edit_id}`}
                            key={edit.edit_id}
                            edit={edit}
                        />
                    ))}
                    {hasNextPage && (
                        <LoadMoreButton
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            ref={ref}
                        />
                    )}
                </div>
            )}
            <ResponsiveModalFooter className="flex-row items-center">
                <Button
                    variant="secondary"
                    className="flex-1"
                    size="md"
                    asChild
                >
                    <Link to="/edit/new" search={{ slug, content_type }}>
                        <MaterialSymbolsEditRounded />
                        Створити правку
                    </Link>
                </Button>
                <QuickEditButton slug={slug} content_type={content_type} />
            </ResponsiveModalFooter>
        </Fragment>
    );
};

export default EditListModal;
