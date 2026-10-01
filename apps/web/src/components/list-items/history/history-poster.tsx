import type { FC } from 'react';

import { cva } from 'class-variance-authority';

import { ContentTypeEnum, type HistoryResponse } from '@hikka/api';

import { contentEntity } from '@/components/content-card/entity';
import EntityCard from '@/components/content-card/entity-card';
import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/utils/cn';

import type { HistorySize } from './history-row';
import type { HistoryMedium } from './types';

type Props = {
    content: HistoryResponse['content'];
    medium: HistoryMedium;
    deleted: boolean;
    size: HistorySize;
};

const MEDIUM_CONTENT_TYPES = {
    watch: [ContentTypeEnum.ANIME],
    read: [ContentTypeEnum.MANGA, ContentTypeEnum.NOVEL],
} as const satisfies Record<HistoryMedium, ContentTypeEnum[]>;

const typeBadgeVariants = cva(
    'absolute bottom-1 left-1 flex size-5 items-center justify-center rounded-sm bg-black/65 text-white [&>svg]:size-3',
    {
        variants: {
            size: {
                default: '',
                lg: 'md:bottom-1.5 md:left-1.5 md:size-6 md:[&>svg]:size-3.5',
            },
        },
    },
);

const HistoryPoster: FC<Props> = ({ content, medium, deleted, size }) => {
    if (!content) {
        return (
            <AspectRatio
                ratio={DEFAULT_CONTAINER_RATIO}
                className="surface flex flex-col items-center justify-center gap-1 rounded-(--base-radius) border border-border text-muted-foreground"
            >
                {MEDIUM_CONTENT_TYPES[medium].map((type) => {
                    const Icon = CONTENT_TYPE_ICONS[type];
                    return <Icon key={type} className="size-4" />;
                })}
            </AspectRatio>
        );
    }

    const TypeIcon = CONTENT_TYPE_ICONS[content.data_type];

    return (
        <EntityCard
            entity={contentEntity(content)}
            title={null}
            containerClassName="rounded-(--base-radius)"
            imageClassName={cn(deleted && 'opacity-40 grayscale')}
            imagePreset="cardXs"
        >
            <span className={typeBadgeVariants({ size })}>
                <TypeIcon />
            </span>
        </EntityCard>
    );
};

export default HistoryPoster;
