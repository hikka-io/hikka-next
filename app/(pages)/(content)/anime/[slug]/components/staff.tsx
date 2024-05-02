'use client';

import * as React from 'react';
import { FC } from 'react';

import { useParams } from 'next/navigation';

import PersonCard from '@/app/(pages)/(content)/components/person-card';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import useStaff from '@/services/hooks/anime/useStaff';

interface Props {
    extended?: boolean;
}

const Staff: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useStaff({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const filteredData = extended ? list : list.slice(0, 4);

    return (
        <Block>
            <Header
                title="Автори"
                href={!extended ? params.slug + '/staff' : undefined}
            />
            <Stack size={4} extended={extended}>
                {filteredData.map((staff) => (
                    <PersonCard
                        key={staff.person.slug}
                        person={staff.person}
                        roles={staff.roles}
                    />
                ))}
            </Stack>
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </Block>
    );
};

export default Staff;
