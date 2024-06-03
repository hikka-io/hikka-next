'use client';

import { useParams } from 'next/navigation';
import { FC, PropsWithChildren, memo } from 'react';

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
    const { list } = usePersonAnime({ slug, size: 100 });
    const { slug: animeSlug } = useParams();

    const currentAnimeInfo = list?.find(
        (anime) => anime.anime.slug === animeSlug,
    );

    if (!data || !currentAnimeInfo) {
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
                        <div className="h-3 w-2/4 rounded-lg bg-secondary/60" />
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
                href={'/people/' + data.slug}
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

                    <div className="flex">
                        <div className="w-1/4">
                            <Label className="text-muted-foreground">
                                Ролі:
                            </Label>
                        </div>
                        <div className="flex-1">
                            {currentAnimeInfo?.roles.map((role, i) => (
                                <span
                                    className="rounded-sm text-sm duration-100"
                                    key={`${slug}-${role}`}
                                >
                                    {role.name_ua || role.name_en}
                                    {i + 1 !==
                                        currentAnimeInfo.roles.length && (
                                        <span>, </span>
                                    )}
                                </span>
                            ))}
                        </div>
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
