'use client';

import { FC, PropsWithChildren, memo } from 'react';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

import ContentCard from '@/components/content-card/content-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';

import usePersonAnime from '@/services/hooks/people/use-person-anime';
import usePersonInfo from '@/services/hooks/people/use-person-info';

interface TooltipDataProps {
    slug: string;
}

interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
}

const TooltipData: FC<TooltipDataProps> = ({ slug }) => {
    const { data } = usePersonInfo({ slug });
    const { list } = usePersonAnime({ slug });

    if (!data || !list) {
        return (
            <div className="flex w-96 animate-pulse gap-4 text-left">
                <div className="h-28 w-20 rounded-lg bg-secondary/60" />
                <div className="flex w-full flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full flex-1 flex-col gap-2">
                            <div className="h-5 w-20 rounded-lg bg-secondary/60" />
                            <div className="h-2 w-full rounded-lg bg-secondary/60" />
                            <div className="h-2 w-full rounded-lg bg-secondary/60" />
                            <div className="h-2 w-full rounded-lg bg-secondary/60" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="h-3 w-1/4 rounded-lg bg-secondary/60" />
                    </div>

                    <div className="flex gap-2">
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-96 gap-4 text-left">
            <ContentCard
                className="w-20"
                poster={data.image}
                containerRatio={0.7}
                href={`/people/${data.slug}`}
            />

            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {data.name_ua || data.name_en || data.name_native}
                    </Label>
                </div>
                <div className="flex flex-col gap-2">
                    <MDViewer className="whitespace-normal break-normal text-sm text-muted-foreground md:line-clamp-3">
                        {data.description_ua}
                    </MDViewer>

                    <div>
                        <Label className="text-muted-foreground">Роботи</Label>
                    </div>

                    <div className="flex gap-2">
                        {list.slice(0, 5).map(({ anime }) => (
                            <ContentCard
                                className="w-10"
                                href={`/anime/${anime.slug}`}
                                key={anime.slug}
                                poster={anime.poster}
                                slug={anime.slug}
                                content_type={anime.data_type}
                                containerRatio={0.7}
                            />
                        ))}
                        {list.length > 5 && (
                            <ContentCard
                                className="w-10"
                                href={`/people/${data.slug}`}
                                poster={
                                    <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                                }
                                containerRatio={0.7}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PersonTooltip: FC<Props> = ({
    slug,
    children,
    withTrigger,
    ...props
}) => {
    if (!slug) return null;

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden min-w-min flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData slug={slug} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(PersonTooltip);
