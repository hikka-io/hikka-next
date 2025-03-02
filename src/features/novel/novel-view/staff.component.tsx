'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import PersonCard from '@/components/person-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useNovelInfo from '@/services/hooks/novel/use-novel-info';

interface Props {
    extended?: boolean;
}

const Staff: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { data } = useNovelInfo({ slug: String(params.slug) });

    if (!data || data.authors.length === 0) {
        return null;
    }

    const authors = data.authors;

    const filteredData = extended ? authors : authors.slice(0, 4);

    return (
        <Block>
            <Header href={!extended ? params.slug + '/staff' : undefined}>
                <HeaderContainer>
                    <HeaderTitle>Автори</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>

            <Stack size={4} extended={extended}>
                {filteredData.map((staff) => (
                    <PersonCard
                        key={staff.person.slug}
                        person={staff.person}
                        roles={staff.roles}
                    />
                ))}
            </Stack>
        </Block>
    );
};

export default Staff;
