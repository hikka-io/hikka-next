import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type ContentAuthorResponse, ContentTypeEnum } from '@hikka/api';
import { getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import { contentHref } from '@/utils/content-href';

import { useVisibleOnce } from './detail-scroll';
import {
    animeStaffPreviewOptions,
    type ContentInfo,
    STAFF_PREVIEW_SIZE,
} from './queries';

type RowProps = {
    list: ContentAuthorResponse[] | undefined;
    isError?: boolean;
    onRetry?: () => void;
    onLayout?: ReturnType<typeof useVisibleOnce>['onLayout'];
};

const StaffRow: FC<RowProps> = ({ list, isError, onRetry, onLayout }) => {
    if (list?.length === 0) {
        return null;
    }

    return (
        <PosterRow<ContentAuthorResponse>
            title="Автори"
            items={list}
            skeleton={{ count: STAFF_PREVIEW_SIZE, description: true }}
            error={isError}
            onRetry={onRetry}
            onLayout={onLayout}
            keyExtractor={(entry) => entry.person.slug}
            renderItem={({ person, roles }) => (
                <PosterCard
                    title={getTitle(person)}
                    description={roles[0] ? getTitle(roles[0]) : undefined}
                    image={person.image ?? undefined}
                    href={contentHref(ContentTypeEnum.PERSON, person.slug)}
                />
            )}
        />
    );
};

const AnimeStaff: FC<{ slug: string }> = ({ slug }) => {
    const { onLayout, visible } = useVisibleOnce();
    const { data, isError, refetch } = useQuery({
        ...animeStaffPreviewOptions(slug),
        enabled: visible,
    });

    return (
        <StaffRow
            list={data?.list}
            isError={isError}
            onRetry={refetch}
            onLayout={onLayout}
        />
    );
};

type Props = {
    content: ContentInfo;
};

const ContentStaff: FC<Props> = ({ content }) =>
    content.data_type === ContentTypeEnum.ANIME ? (
        <AnimeStaff slug={content.slug} />
    ) : (
        <StaffRow list={content.authors} />
    );

export default ContentStaff;
