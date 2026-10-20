import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { RefreshControl, ScrollView } from 'react-native';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';
import { contentPath } from '@hikka/core';

import DetailHeaderChrome from '@/components/detail-header-chrome';
import ErrorState from '@/components/ui/error-state';
import { useTitle } from '@/services/session';
import { isNotFoundError } from '@/utils/api/is-not-found';
import { bySlug, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import ContentCharacters from './content-characters';
import ContentComments from './content-comments';
import ContentDetailSkeleton from './content-detail-skeleton';
import ContentDetails from './content-details';
import ContentFranchise from './content-franchise';
import ContentHero from './content-hero';
import ContentLinks from './content-links';
import ContentRecommendations from './content-recommendations';
import ContentStaff from './content-staff';
import ContentSynopsis from './content-synopsis';
import DetailScrollProvider, {
    useDetailScroll,
    useScrolledPast,
} from './detail-scroll';
import { type ContentInfo, contentInfoOptions } from './queries';

type SectionProps = {
    content: ContentInfo;
};

const SECTIONS = {
    synopsis: ContentSynopsis,
    details: ContentDetails,
    franchise: ContentFranchise,
    characters: ContentCharacters,
    staff: ContentStaff,
    recommendations: ContentRecommendations,
    links: ContentLinks,
    comments: ContentComments,
} satisfies Record<string, FC<SectionProps>>;

type DetailSection = keyof typeof SECTIONS;

const READ_SECTIONS = [
    'synopsis',
    'details',
    'franchise',
    'characters',
    'staff',
    'links',
    'comments',
] as const satisfies readonly DetailSection[];

const DETAIL_SECTIONS = {
    [ContentTypeEnum.ANIME]: [
        'synopsis',
        'details',
        'franchise',
        'characters',
        'staff',
        'recommendations',
        'links',
        'comments',
    ],
    [ContentTypeEnum.MANGA]: READ_SECTIONS,
    [ContentTypeEnum.NOVEL]: READ_SECTIONS,
} as const satisfies Record<MainContentTypeEnum, readonly DetailSection[]>;

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
};

const ContentDetailBody: FC<Props> = ({ contentType, slug }) => {
    const getTitle = useTitle();
    const {
        data: content,
        error,
        refetch,
    } = useQuery(contentInfoOptions(contentType, slug));
    const { onScroll, onLayout } = useDetailScroll();
    const [titleBottom, setTitleBottom] = useState<number | null>(null);
    const titleVisible = useScrolledPast(titleBottom);
    const { refreshing, onRefresh } = usePullToRefresh(bySlug(slug));

    return (
        <>
            <DetailHeaderChrome
                title={content ? getTitle(content) : ''}
                titleVisible={titleVisible}
                sharePath={content ? contentPath(contentType, slug) : undefined}
            />
            <ScrollView
                className="flex-1 bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="gap-6 px-4 pt-4 pb-16"
                scrollEventThrottle={16}
                onScroll={onScroll}
                onLayout={onLayout}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {content ? (
                    <>
                        <ContentHero
                            contentType={contentType}
                            content={content}
                            onTitleBottom={setTitleBottom}
                        />
                        {DETAIL_SECTIONS[contentType].map((key) => {
                            const Section = SECTIONS[key];
                            return <Section key={key} content={content} />;
                        })}
                    </>
                ) : error ? (
                    <ErrorState
                        error={error}
                        onRetry={refetch}
                        notFound={isNotFoundError(error)}
                        className="pt-16"
                    />
                ) : (
                    <ContentDetailSkeleton />
                )}
            </ScrollView>
        </>
    );
};

const ContentDetailPage: FC<Props> = ({ contentType, slug }) => (
    <DetailScrollProvider key={slug}>
        <ContentDetailBody contentType={contentType} slug={slug} />
    </DetailScrollProvider>
);

export default ContentDetailPage;
