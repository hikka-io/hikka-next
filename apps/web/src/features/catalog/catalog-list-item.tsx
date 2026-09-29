import { Fragment, type ReactNode } from 'react';

import type {
    AnimeResponseWithWatch,
    ContentTypeEnum,
    MangaResponseWithRead,
    NovelResponseWithRead,
} from '@hikka/api';

import CompanyTitleLink from '@/components/company-title-link';
import { PosterCard } from '@/components/content-card';
import ContentGenres from '@/components/content-genres';
import {
    HorizontalCardDescription,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import InlineScores from '@/components/inline-scores';
import MagazineTitleLink from '@/components/magazine-title-link';
import { TrackingButtonsGroup } from '@/components/tracking';
import { Separator } from '@/components/ui/separator';
import { useTitle } from '@/services/session';
import { getMediaTypeLabel, RELEASE_STATUS } from '@/utils/labels';

type Props =
    | {
          type: typeof ContentTypeEnum.ANIME;
          item: AnimeResponseWithWatch;
          title?: string;
      }
    | {
          type: typeof ContentTypeEnum.MANGA;
          item: MangaResponseWithRead;
          title?: string;
      }
    | {
          type: typeof ContentTypeEnum.NOVEL;
          item: NovelResponseWithRead;
          title?: string;
      };

export default function CatalogListItem(props: Props) {
    const { item, type } = props;
    const title = useTitle(item);
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

    const mediaType = getMediaTypeLabel(item.media_type);

    const status = item.status
        ? RELEASE_STATUS[item.status as keyof typeof RELEASE_STATUS]?.title_ua
        : undefined;

    return (
        <div className="surface -mx-4 flex flex-col gap-4 rounded-none border border-border border-x-0 p-4 md:mx-0 md:rounded-(--base-radius) md:border-x">
            <div className="flex gap-4">
                <PosterCard
                    className="w-24 shrink-0 md:w-16"
                    containerClassName="rounded-(--base-radius)"
                    image={item?.image}
                    href={href}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-stretch md:gap-4">
                    <div className="flex min-w-0 flex-1 flex-col justify-start gap-3 md:justify-center">
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
                                    <Fragment key={String(info)}>
                                        {index > 0 && (
                                            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                                        )}
                                        {info}
                                    </Fragment>
                                ))}
                        </HorizontalCardDescription>
                        <ContentGenres
                            className="md:hidden"
                            contentType={type}
                            genres={item.genres}
                            maxItems={2}
                        />
                        <ContentGenres
                            className="hidden md:flex"
                            contentType={type}
                            genres={item.genres}
                            maxItems={4}
                        />
                    </div>

                    <Separator
                        orientation="vertical"
                        className="hidden md:block"
                    />

                    <div className="flex flex-col justify-center gap-3 md:w-64 md:shrink-0">
                        <InlineScores
                            hikkaScore={item.native_score}
                            hikkaScoreCount={item.native_scored_by}
                            malScore={item.score}
                            malScoreCount={item.scored_by}
                        />
                        <div className="hidden w-full md:grid">
                            <TrackingButtonsGroup {...props} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid w-full md:hidden">
                <TrackingButtonsGroup {...props} />
            </div>
        </div>
    );
}
