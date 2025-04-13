'use client';

import Link from 'next/link';
import { FC, PropsWithChildren, memo } from 'react';

import useSession from '../../services/hooks/auth/use-session';
import useNovelInfo from '../../services/hooks/novel/use-novel-info';
import { NOVEL_MEDIA_TYPE, RELEASE_STATUS } from '../../utils/constants/common';
import MDViewer from '../markdown/viewer/MD-viewer';
import ReadlistButton from '../readlist-button/readlist-button';
import H5 from '../typography/h5';
import { Badge } from '../ui/badge';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '../ui/hover-card';
import { Label } from '../ui/label';

interface TooltipDataProps {
    slug: string;
    read?: API.Read;
}

interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
    read?: API.Read;
}

const TooltipData: FC<TooltipDataProps> = ({ slug, read }) => {
    const { user: loggedUser } = useSession();
    const { data } = useNovelInfo({ slug });

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
                <div className="flex gap-2">
                    <div className="h-3 w-1/4 rounded-lg bg-secondary/20" />
                    <div className="h-3 flex-1 rounded-lg bg-secondary/20" />
                </div>
                <div className="flex gap-2">
                    <div className="h-3 w-1/4 rounded-lg bg-secondary/20" />
                    <div className="h-3 w-2/4 rounded-lg bg-secondary/20" />
                </div>
                <div className="h-12 w-full rounded-md bg-secondary/20" />
            </div>
        );
    }

    const synopsis = data.synopsis_ua || data.synopsis_en;

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                    <H5>{data.title}</H5>
                    {data.score > 0 ? (
                        <div className="size-fit rounded-md border  border-accent bg-accent px-2 text-sm text-accent-foreground">
                            {data.score}
                        </div>
                    ) : null}
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
                                {NOVEL_MEDIA_TYPE[data.media_type].title_ua}
                            </Label>
                        )}
                        <Badge
                            variant="status"
                            bgColor={RELEASE_STATUS[data.status].color}
                        >
                            {RELEASE_STATUS[data.status].title_ua}
                        </Badge>
                    </div>
                </div>
                {data.volumes && (
                    <div className="flex">
                        <div className="w-1/4">
                            <Label className="text-muted-foreground">
                                Томи:
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Label>{data.volumes}</Label>
                        </div>
                    </div>
                )}
                {data.chapters && (
                    <div className="flex">
                        <div className="w-1/4">
                            <Label className="text-muted-foreground">
                                Розділи:
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Label>{data.chapters}</Label>
                        </div>
                    </div>
                )}
                <div className="flex">
                    <div className="w-1/4">
                        <Label className="text-muted-foreground">Жанри:</Label>
                    </div>
                    <div className="flex-1">
                        {data.genres.map((genre, i) => (
                            <span key={genre.slug}>
                                <Link
                                    className="rounded-sm text-sm underline decoration-primary decoration-dashed transition-colors duration-100 hover:bg-primary hover:text-primary-foreground"
                                    href={`/novel?genres=${genre.slug}`}
                                >
                                    {genre.name_ua}
                                </Link>
                                {i + 1 !== data.genres.length && (
                                    <span>, </span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {loggedUser && (
                <ReadlistButton slug={slug} content_type="novel" read={read} />
            )}
        </>
    );
};

const NovelTooltip: FC<Props> = ({ slug, children, withTrigger, read }) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden w-80 flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData slug={slug} read={read} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(NovelTooltip);
