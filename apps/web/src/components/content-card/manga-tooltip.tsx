'use client';

import { ContentTypeEnum, ReadResponseBase } from '@hikka/client';
import { useMangaBySlug, useSession } from '@hikka/react';
import Link from 'next/link';
import { FC, PropsWithChildren, memo } from 'react';

import { Badge } from '@/components/ui/badge';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';
import { MANGA_MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants/common';

import { useSettingsStore } from '@/services/stores/settings-store';

import MDViewer from '../markdown/viewer/MD-viewer';
import ReadlistButton from '../readlist-button/readlist-button';
import H5 from '../typography/h5';

interface TooltipDataProps {
    slug: string;
    read?: ReadResponseBase;
}

interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
    read?: ReadResponseBase;
}

const TooltipData: FC<TooltipDataProps> = ({ slug, read }) => {
    const { user: loggedUser } = useSession();
    const { data } = useMangaBySlug({ slug });

    const secondaryTitleLanguage = useSettingsStore((state) => state.secondaryTitleLanguage);

    if (!data) {
        return (
            <div className="flex animate-pulse flex-col gap-4">
                <div className="flex justify-between gap-2">
                    <div className="h-4 flex-1 rounded-lg bg-secondary/20" />
                    <div className="h-4 w-10 rounded-lg bg-secondary/20" />
                </div>
                <div className="flex flex-col gap-2 py-3">
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-1/3 rounded-lg bg-secondary/20" />
                </div>
                <div className="h-12 w-full rounded-md bg-secondary/20" />
            </div>
        );
    }

    const getSecondaryTitle = () => {
        if (secondaryTitleLanguage === 'none') return null;

        if (secondaryTitleLanguage === 'en') {
            // Беремо англійську, якщо нема - ромадзі (якщо воно є в типі) або оригінальну
            return data.title_en || (data as any).title_romaji || data.title_original || null;
        }

        if (secondaryTitleLanguage === 'ja') {
            // Пріоритет на ja, потім на оригінал
            return data.title_ja || data.title_original || null;
        }

        return null;
    };

    const secondaryTitle = getSecondaryTitle();
    const synopsis = data.synopsis_ua || data.synopsis_en;

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between gap-2">
                        <H5>{data.title}</H5>
                        {data.score > 0 && (
                            <div className="size-fit rounded-md border bg-secondary/20 backdrop-blur px-2 text-sm">
                                {data.score}
                            </div>
                        )}
                    </div>
                    {secondaryTitle && secondaryTitle !== data.title && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                            {secondaryTitle}
                        </span>
                    )}
                </div>
                {synopsis && (
                    <MDViewer className="mb-2 line-clamp-4 text-sm text-muted-foreground">
                        {synopsis}
                    </MDViewer>
                )}
                <div className="flex items-center">
                    <div className="w-1/4">
                        <Label className="text-muted-foreground">Тип:</Label>
                    </div>
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {data.media_type && (
                            <Label>
                                {MANGA_MEDIA_TYPE[data.media_type].title_ua}
                            </Label>
                        )}
                        {data.status && (
                            <Badge
                                variant="status"
                                className={cn(
                                    `bg-${data.status} text-${data.status}-foreground border-${data.status}-border`,
                                )}
                            >
                                {RELEASE_STATUS[data.status].title_ua}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/4">
                        <Label className="text-muted-foreground">Жанри:</Label>
                    </div>
                    <div className="flex-1">
                        {data.genres.map((genre, i) => (
                            <span key={genre.slug}>
                                <Link
                                    className="text-sm underline decoration-primary-foreground decoration-dashed transition-colors duration-100 hover:bg-primary-border hover:text-primary-foreground"
                                    href={`/manga?genres=${genre.slug}`}
                                >
                                    {genre.name_ua}
                                </Link>
                                {i + 1 !== data.genres.length && <span>, </span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {loggedUser && (
                <ReadlistButton
                    slug={slug}
                    content_type={ContentTypeEnum.MANGA}
                    read={read}
                />
            )}
        </>
    );
};

const MangaTooltip: FC<Props> = ({ slug, children, read }) => {
    if (!slug) return null;

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent side="right" className="hidden w-80 flex-col gap-4 p-4 md:flex">
                    <HoverCardArrow />
                    <TooltipData slug={slug} read={read} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(MangaTooltip);
