import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getMediaTypeLabel } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import { useTitle } from '@/services/session';
import { contentHref } from '@/utils/content-href';

import { useVisibleOnce } from './detail-scroll';
import { type FranchiseEntry, getFranchiseEntries } from './franchise-entries';
import { type ContentInfo, contentRelatedFranchiseOptions } from './queries';

const FRANCHISE_SKELETON_COUNT = 4;

type Props = {
    content: ContentInfo;
};

const ContentFranchise: FC<Props> = ({ content }) => {
    const getTitle = useTitle();
    const { onLayout, visible } = useVisibleOnce();
    const { data, isError, refetch } = useQuery({
        ...contentRelatedFranchiseOptions(content.data_type, content.slug),
        enabled: visible && content.has_franchise,
    });

    const entries = data ? getFranchiseEntries(data, content.slug) : undefined;

    if (!content.has_franchise || entries?.length === 0) {
        return null;
    }

    return (
        <PosterRow<FranchiseEntry>
            title="Франшиза"
            items={entries}
            skeleton={{ count: FRANCHISE_SKELETON_COUNT, subtitles: true }}
            error={isError}
            onRetry={refetch}
            onLayout={onLayout}
            keyExtractor={(entry) => `${entry.data_type}-${entry.slug}`}
            renderItem={(entry) => (
                <PosterCard
                    title={getTitle(entry)}
                    image={entry.image ?? undefined}
                    leftSubtitle={getMediaTypeLabel(entry.media_type)}
                    rightSubtitle={entry.year ? String(entry.year) : null}
                    href={contentHref(entry.data_type, entry.slug)}
                />
            )}
        />
    );
};

export default ContentFranchise;
