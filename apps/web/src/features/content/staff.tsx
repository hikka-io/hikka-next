'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import PersonCard from '@/components/person-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { useStaff } from './hooks/use-staff';

interface Props {
    extended?: boolean;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Staff: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useStaff({ content_type, slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const filteredData = extended ? list : list.slice(0, 5);

    return (
        <Block>
            <Header href={!extended ? params.slug + '/staff' : undefined}>
                <HeaderContainer>
                    <HeaderTitle>Автори</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack
                size={5}
                extendedSize={5}
                className="grid-min-6"
                extended={extended}
            >
                {filteredData.map((staff) => (
                    <PersonCard
                        key={staff.person.slug}
                        person={staff.person}
                        roles={staff.roles}
                    />
                ))}
            </Stack>
            {fetchNextPage && extended && hasNextPage && (
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
