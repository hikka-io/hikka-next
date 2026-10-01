import type { FC } from 'react';

import { ContentTypeEnum, type HistoryResponse } from '@hikka/api';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import PosterCard from '@/components/content-card/poster-card';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/utils/cn';
import { contentPath } from '@/utils/content-paths';

import type { HistoryMedium } from './types';

type Props = {
    content: HistoryResponse['content'];
    medium: HistoryMedium;
    deleted: boolean;
    className?: string;
};

const MEDIUM_CONTENT_TYPES = {
    watch: [ContentTypeEnum.ANIME],
    read: [ContentTypeEnum.MANGA, ContentTypeEnum.NOVEL],
} as const satisfies Record<HistoryMedium, ContentTypeEnum[]>;

const HistoryPoster: FC<Props> = ({ content, medium, deleted, className }) => {
    if (!content) {
        return (
            <div className={cn('shrink-0', className)}>
                <AspectRatio
                    ratio={DEFAULT_CONTAINER_RATIO}
                    className="surface flex flex-col items-center justify-center gap-1 rounded-(--base-radius) border border-border text-muted-foreground"
                >
                    {MEDIUM_CONTENT_TYPES[medium].map((type) => {
                        const Icon = CONTENT_TYPE_ICONS[type];
                        return <Icon key={type} className="size-4" />;
                    })}
                </AspectRatio>
            </div>
        );
    }

    const TypeIcon = CONTENT_TYPE_ICONS[content.data_type];

    return (
        <PosterCard
            className={cn('shrink-0', className)}
            containerClassName="rounded-(--base-radius)"
            imageClassName={cn(deleted && 'opacity-40 grayscale')}
            image={content.image}
            to={contentPath(content.data_type, content.slug)}
            imagePreset="cardXs"
        >
            <span className="absolute bottom-1 left-1 flex size-5 items-center justify-center rounded-sm bg-black/65 text-white">
                <TypeIcon className="size-3" />
            </span>
        </PosterCard>
    );
};

export default HistoryPoster;
