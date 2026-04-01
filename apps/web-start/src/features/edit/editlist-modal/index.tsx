'use client';

import { EditContentType } from '@hikka/client';
import { useEditList } from '@hikka/react';
import { Fragment } from 'react';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';

import { Link } from '@/utils/navigation';

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
        <Fragment>
            {list!.length > 0 && (
                <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
                    {list!.map((edit) => (
                        <EditCard
                            to={`/edit/` + edit.edit_id}
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
            <ResponsiveModalFooter>
                <Button
                    variant="secondary"
                    className="w-full"
                    size="md"
                    asChild
                >
                    <Link to="/edit/new" search={{ slug, content_type }}>
                        <MaterialSymbolsEditRounded />
                        Створити правку
                    </Link>
                </Button>
            </ResponsiveModalFooter>
        </Fragment>
    );
};

export default Component;
