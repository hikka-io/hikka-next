import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import PersonCard from '@/components/content-card/person-card';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { useParams } from '@/utils/navigation';

import StaffSkeleton from './staff-skeleton';
import { useStaff } from './use-staff';

type Props = {
    extended?: boolean;
    content_type: MainContentTypeEnum;
};

const ContentStaff: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { ref: visibleRef, visible } = useVisibleOnce();
    const {
        list,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useStaff({
        content_type,
        slug: String(params.slug),
        enabled: extended || visible,
    });

    if (!list) {
        return !extended && isPending ? (
            <div ref={visibleRef}>
                <StaffSkeleton />
            </div>
        ) : null;
    }

    if (list.length === 0) {
        return null;
    }

    const filteredData = extended ? list : list.slice(0, 5);

    const block = (
        <Block id="content-staff">
            <Header
                href={
                    !extended
                        ? `${CONTENT_TYPE_LINKS[content_type]}/${params.slug}/staff`
                        : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Автори</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack
                size={5}
                extendedSize={5}
                className="grid-min-6 grid-cols-3 sm:grid-cols-4"
                extended={extended}
                imagePreset="card"
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

    return extended ? block : <div ref={visibleRef}>{block}</div>;
};

export default ContentStaff;
