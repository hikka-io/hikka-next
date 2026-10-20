import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type ContentAuthorResponse, ContentTypeEnum } from '@hikka/api';
import { getTitle } from '@hikka/core';

import { presetImageUrl } from '@/components/content-card/image-presets';
import PosterCard from '@/components/content-card/poster-card';

import { contentHref } from './content-href';
import { useVisibleOnce } from './detail-scroll';
import PosterRow from './poster-row';
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
            skeletonCount={STAFF_PREVIEW_SIZE}
            description
            error={isError}
            onRetry={onRetry}
            onLayout={onLayout}
            keyExtractor={(entry) => entry.person.slug}
            renderItem={({ person, roles }) => (
                <PosterCard
                    title={getTitle(person)}
                    description={roles[0] ? getTitle(roles[0]) : undefined}
                    image={presetImageUrl(person.image, 'cardSm')}
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
