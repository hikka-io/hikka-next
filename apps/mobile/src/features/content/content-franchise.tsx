import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getMediaTypeLabel, getTitle } from '@hikka/core';

import { presetImageUrl } from '@/components/content-card/image-presets';
import PosterCard from '@/components/content-card/poster-card';

import { contentHref } from './content-href';
import { useVisibleOnce } from './detail-scroll';
import { type FranchiseEntry, getFranchiseEntries } from './franchise-entries';
import PosterRow from './poster-row';
import { type ContentInfo, contentRelatedFranchiseOptions } from './queries';

const FRANCHISE_SKELETON_COUNT = 4;

type Props = {
    content: ContentInfo;
};

const ContentFranchise: FC<Props> = ({ content }) => {
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
            skeletonCount={FRANCHISE_SKELETON_COUNT}
            subtitles
            error={isError}
            onRetry={refetch}
            onLayout={onLayout}
            keyExtractor={(entry) => `${entry.data_type}-${entry.slug}`}
            renderItem={(entry) => (
                <PosterCard
                    title={getTitle(entry)}
                    image={presetImageUrl(entry.image, 'cardSm')}
                    leftSubtitle={getMediaTypeLabel(entry.media_type)}
                    rightSubtitle={entry.year ? String(entry.year) : null}
                    href={contentHref(entry.data_type, entry.slug)}
                />
            )}
        />
    );
};

export default ContentFranchise;
