import {
    type AnimeResponseWithWatch,
    type ContentTypeEnum,
    type MangaResponseWithRead,
    type NovelResponseWithRead,
} from '@hikka/api';

import { ContentGenres } from '@/features/content';
import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
    RELEASE_STATUS,
} from '@/utils/constants/filter-properties';
import { Link } from '@/utils/navigation';
import { Fragment, ReactNode } from 'react';
import { TrackingButtonsGroup } from '../action-buttons';
import { ContentCard } from '../content-card';
import {
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardTitle,
} from '../ui/horizontal-card';
import { InlineScores } from './inline-scores';
import { CompanyTitleLink } from './company-title-link';
import { MagazineTitleLink } from './magazine-title-link';

const MEDIA_TYPE_ENUM = Object.assign(
    {},
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
);

type Props =
    | {
          title: string;
          type: typeof ContentTypeEnum.ANIME;
          item: AnimeResponseWithWatch;
      }
    | {
          title: string;
          type: typeof ContentTypeEnum.MANGA;
          item: MangaResponseWithRead;
      }
    | {
          title: string;
          type: typeof ContentTypeEnum.NOVEL;
          item: NovelResponseWithRead;
      };

export function ContentListItem(props: Props) {
    const { item, title, type } = props;

    const href = `/${type}/${item.slug}`;

    let CompanyView: ReactNode;
    if ('studios' in item) {
        const studio = item.studios?.[0];

        if (studio) {
            CompanyView = <CompanyTitleLink studio={studio} />;
        }
    } else if ('magazines' in item) {
        const magazine = item.magazines?.[0];

        if (magazine) {
            CompanyView = (
                <MagazineTitleLink magazine={magazine} type={item.data_type} />
            );
        }
    }

    const mediaType = item.media_type
        ? MEDIA_TYPE_ENUM[item.media_type as keyof typeof MEDIA_TYPE_ENUM]
              ?.title_ua
        : undefined;

    const status = item.status
        ? RELEASE_STATUS[item.status as keyof typeof RELEASE_STATUS]?.title_ua
        : undefined;

    return (
        <div className="flex min-h-[100px] w-full flex-col rounded-(--base-radius) border-1 bg-card shadow-sm lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-row lg:p-3">
                <div className="shrink-0 self-stretch p-3 pr-0 lg:p-0">
                    <ContentCard
                        className="w-30 lg:w-20"
                        containerClassName="relative z-0 rounded-(--base-radius)"
                        imagePreset='cardXs'
                        image={item?.image}
                        href={href}
                        slug={item.slug}
                        content_type={type}
                        watch={'watch' in item ? item.watch[0] : undefined}
                        read={'read' in item ? item.read[0] : undefined}
                        tooltipDisabled
                    />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1 p-3">
                    <HorizontalCardContainer className="w-full gap-3 justify-start pt-2 lg:pt-0">
                        <HorizontalCardTitle to={href} className="min-w-0">
                            {title}
                        </HorizontalCardTitle>
                        <HorizontalCardDescription className="flex-wrap">
                            {CompanyView && (
                                <>
                                    {CompanyView}
                                    <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                                </>
                            )}
                            {[mediaType, item.year, status]
                                .filter(Boolean)
                                .map((info, index) => (
                                    <Fragment key={index}>
                                        {index > 0 && (
                                            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                                        )}
                                        {info}
                                    </Fragment>
                                ))}
                        </HorizontalCardDescription>
                        <ContentGenres
                            className="lg:hidden"
                            contentType={'anime'}
                            genres={item.genres}
                            maxItems={2}
                        />
                        <ContentGenres
                            className="hidden lg:flex"
                            contentType={'anime'}
                            genres={item.genres}
                            /* Desktop have more space for tags (genres)`*/
                            maxItems={4}
                        />
                    </HorizontalCardContainer>
                    {/* Scores drop to the bottom of the card when the row is narrow */}
                    <div className="mt-auto pt-1 lg:hidden">
                        <InlineScores
                            hikkaScore={item.native_score}
                            hikkaScoreCount={item.native_scored_by}
                            malScore={item.score}
                            malScoreCount={item.scored_by}
                        />
                    </div>
                </div>
                <div className="hidden w-[300px] shrink-0 flex-col items-center justify-start gap-3 p-3 lg:p-0 lg:pt-3 lg:flex">
                    <InlineScores
                        hikkaScore={item.native_score}
                        hikkaScoreCount={item.native_scored_by}
                        malScore={item.score}
                        malScoreCount={item.scored_by}
                    />
                    <div className="grid w-full">
                        <TrackingButtonsGroup {...props} />
                    </div>
                </div>
            </div>
            {/* Tracking buttons move under the whole card when the row is narrow */}
            <div className="px-3 pb-3 lg:hidden grid w-full">
                <TrackingButtonsGroup {...props} />
            </div>
        </div>
    );
}
