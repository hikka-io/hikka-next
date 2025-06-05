'use client';

import {
    useCharacterAnime,
    useCharacterBySlug,
    useSession,
} from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import MDViewer from '../markdown/viewer/MD-viewer';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '../ui/hover-card';
import { Label } from '../ui/label';
import ContentCard from './content-card';

interface TooltipDataProps {
    slug: string;
}

interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
}

const TooltipData: FC<TooltipDataProps> = ({ slug }) => {
    const { user: loggedUser } = useSession();
    const { data } = useCharacterBySlug({ slug });
    const { list } = useCharacterAnime({ slug });

    const characterAnime = list?.sort(
        (a, b) => b.anime.score - a.anime.score,
    )[0];

    if (!data) {
        return (
            <div className="flex w-96 animate-pulse gap-4 text-left">
                <div className="bg-secondary/20 h-28 w-20 rounded-lg" />
                <div className="flex w-full flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full flex-1 flex-col gap-2">
                            <div className="bg-secondary/20 h-5 w-20 rounded-lg" />
                            <div className="bg-secondary/20 h-2 w-full rounded-lg" />
                            <div className="bg-secondary/20 h-2 w-full rounded-lg" />
                            <div className="bg-secondary/20 h-2 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="bg-secondary/20 h-14 w-10 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-96 gap-4 text-left">
            <ContentCard
                className="w-20"
                image={data.image}
                containerRatio={0.7}
                href={'/characters/' + data.slug}
            />
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {data.name_ua || data.name_en || data.name_ja}
                    </Label>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <MDViewer className="text-muted-foreground whitespace-normal break-normal text-sm md:line-clamp-3">
                            {data.description_ua}
                        </MDViewer>
                    </div>
                </div>
            </div>
            {characterAnime && (
                <div className="flex flex-col gap-2">
                    <ContentCard
                        className="w-10"
                        image={characterAnime.anime.image}
                        containerRatio={0.7}
                        href={'/anime/' + characterAnime.anime.slug}
                    />
                </div>
            )}
        </div>
    );
};

const CharacterTooltip: FC<Props> = ({
    slug,
    children,
    withTrigger,
    ...props
}) => {
    if (!slug) {
        return null;
    }

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

export default memo(CharacterTooltip);
