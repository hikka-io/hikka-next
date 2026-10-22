import type { FC } from 'react';

import { ArrowRight } from 'lucide-react';

import { CONTENT_COUNT_FORMS, getDeclensionWord } from '@hikka/core';

import { useImagePreset } from '@/components/ui/image-preset-context';
import { cn } from '@/utils/cn';

import CardImage from './card-image';
import { IMAGE_PRESETS } from './image-presets';
import PosterCard from './poster-card';

type Props = {
    to: string;
    linkProps?: Record<string, unknown>;
    /** The poster of the next item, shown sharp at the top and fading into a blur. */
    image?: string | null;
    /** Blurs the whole poster, for spoiler and +18 content. */
    blurred?: boolean;
    total: number;
    contentType: keyof typeof CONTENT_COUNT_FORMS;
    className?: string;
};

/** The last card of a preview row: it previews the next item, shows the full count and opens the whole list. */
const MorePosterCard: FC<Props> = ({
    to,
    linkProps,
    image,
    blurred,
    total,
    contentType,
    className,
}) => {
    const preset = IMAGE_PRESETS[useImagePreset() ?? 'card'];

    return (
        <PosterCard
            className={className}
            to={to}
            linkProps={linkProps}
            image={
                <div className="absolute inset-0">
                    {image && !blurred && (
                        <CardImage
                            image={image}
                            imageProps={preset}
                            className="size-full! object-cover"
                        />
                    )}
                    {image && (
                        // Scaled past the clip so the blur's soft edges stay hidden.
                        <CardImage
                            image={image}
                            blurred
                            className={cn(
                                'scale-110',
                                !blurred && 'gradient-mask-t-40',
                            )}
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col @min-[8rem]:p-3 p-2 text-white">
                        <div className="flex items-center justify-between gap-1">
                            <span className="font-bold @min-[8rem]:text-2xl text-lg tabular-nums @min-[8rem]:leading-8 leading-6">
                                {total}
                            </span>
                            <ArrowRight className="@min-[8rem]:size-5 size-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                        </div>
                        <span className="truncate text-white/70 text-xs leading-4">
                            {getDeclensionWord(
                                total,
                                CONTENT_COUNT_FORMS[contentType],
                            )}
                        </span>
                    </div>
                </div>
            }
        />
    );
};

export default MorePosterCard;
