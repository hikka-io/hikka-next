'use client';

import { ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';

import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/cn';
import { CONTENT_CONFIG } from '@/utils/constants/common';

interface TitleProps {
    className?: string;
    content_type:
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;
}

const Title = ({ className, content_type }: TitleProps) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    // Get the language preference for the secondary title from the settings store
    const secondaryTitleLanguage = useSettingsStore((state) => state.secondaryTitleLanguage);

    if (!data) {
        return null;
    }

    // Determine the secondary title based on user preferences and available data fallbacks
    const getSecondaryTitle = () => {
        if (secondaryTitleLanguage === 'none') return null;

        if (secondaryTitleLanguage === 'en') {
            // Fallback chain: English -> Romaji -> Original
            return data.title_en || (data as any).title_romaji || data.title_original || null;
        }

        if (secondaryTitleLanguage === 'ja') {
            // Fallback chain: Japanese -> Original
            return data.title_ja || data.title_original || null;
        }

        return null;
    };

    const secondaryTitle = getSecondaryTitle();

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
                <div>
                    <H2>
                        {data.title}{' '}
                        {data.start_date && (
                            <span className="font-sans font-normal">
                                (
                                {new Date(data.start_date * 1000).getFullYear()}
                                )
                            </span>
                        )}
                    </H2>

                    {/* Render secondary title if it exists and differs from the primary one */}
                    {secondaryTitle && secondaryTitle !== data.title && (
                        <P className="text-muted-foreground text-sm">
                            {secondaryTitle}
                        </P>
                    )}
                </div>
                {data.score > 0 && (
                    <div className="bg-secondary/20 flex items-center gap-1 rounded-md border px-2 backdrop-blur">
                        <div className="font-display text-xl font-bold">
                            {data.score}
                        </div>

                        <MaterialSymbolsStarRounded className="text-xl text-yellow-400" />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-2">
                {data.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.genres.map((genre, i) => (
                            <span key={genre.slug} className="text-sm">
                                <Link
                                    className="decoration-primary-foreground hover:bg-primary-border hover:text-primary-foreground rounded px-1 underline decoration-dashed transition-colors duration-100"
                                    href={`/${content_type}?genres=${genre.slug}`}
                                >
                                    {genre.name_ua}
                                </Link>
                                {i + 1 !== data.genres.length && <span>, </span>}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Title;
