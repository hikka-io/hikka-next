import type { FC, ReactNode } from 'react';

import { range } from '@antfu/utils';
import { useQuery } from '@tanstack/react-query';

import {
    type ContentAuthorResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
} from '@hikka/api';

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
import {
    type ContentInfo,
    contentInfoOptions,
} from '@/utils/api/content-queries';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { useParams } from '@/utils/navigation';

import { animeStaffOptions } from './queries';
import StaffSkeleton from './staff-skeleton';

const PREVIEW_SIZE = 5;

type Props = {
    extended?: boolean;
    content_type: MainContentTypeEnum;
};

type StaffSourceProps = {
    slug: string;
    extended?: boolean;
    visibleRef: (node?: Element | null) => void;
};

type StaffBlockProps = StaffSourceProps & {
    content_type: MainContentTypeEnum;
    list: ContentAuthorResponse[] | undefined;
    isPending: boolean;
    loadMore?: ReactNode;
};

const StaffBlock: FC<StaffBlockProps> = ({
    slug,
    extended,
    visibleRef,
    content_type,
    list,
    isPending,
    loadMore,
}) => {
    if (!list ? extended || !isPending : list.length === 0) {
        return null;
    }

    const filteredData = extended ? list : list?.slice(0, PREVIEW_SIZE);

    const block = (
        <Block id="content-staff">
            <Header
                href={
                    !extended
                        ? `${CONTENT_TYPE_LINKS[content_type]}/${slug}/staff`
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
                {filteredData
                    ? filteredData.map((staff) => (
                          <PersonCard
                              key={staff.person.slug}
                              person={staff.person}
                              roles={staff.roles}
                          />
                      ))
                    : range(0, PREVIEW_SIZE).map((index) => (
                          <StaffSkeleton key={index} />
                      ))}
            </Stack>
            {loadMore}
        </Block>
    );

    return extended ? block : <div ref={visibleRef}>{block}</div>;
};

const AnimeStaff: FC<StaffSourceProps & { enabled: boolean }> = ({
    enabled,
    ...props
}) => {
    const {
        list,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useInfiniteList(animeStaffOptions(props.slug), { enabled });

    return (
        <StaffBlock
            {...props}
            content_type={ContentTypeEnum.ANIME}
            list={list}
            isPending={isPending}
            loadMore={
                props.extended &&
                hasNextPage && (
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                )
            }
        />
    );
};

const selectAuthors = (data: ContentInfo<ReadContentTypeEnum>) => data.authors;

const AuthorStaff: FC<
    StaffSourceProps & { content_type: ReadContentTypeEnum }
> = ({ content_type, ...props }) => {
    const { data: list, isPending } = useQuery({
        ...contentInfoOptions(content_type, props.slug),
        select: selectAuthors,
    });

    return (
        <StaffBlock
            {...props}
            content_type={content_type}
            list={list}
            isPending={isPending}
        />
    );
};

const ContentStaff: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { ref: visibleRef, visible } = useVisibleOnce();
    const slug = String(params.slug);

    return content_type === ContentTypeEnum.ANIME ? (
        <AnimeStaff
            slug={slug}
            extended={extended}
            visibleRef={visibleRef}
            enabled={!!extended || visible}
        />
    ) : (
        <AuthorStaff
            content_type={content_type}
            slug={slug}
            extended={extended}
            visibleRef={visibleRef}
        />
    );
};

export default ContentStaff;
