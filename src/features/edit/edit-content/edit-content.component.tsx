'use client';

import Link from 'next/link';
import * as React from 'react';
import { FC } from 'react';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';
import MaterialSymbolsArticleOutlineRounded from '~icons/material-symbols/article-outline-rounded';
import MaterialSymbolsCalendarClockRounded from '~icons/material-symbols/calendar-clock-rounded';
import MaterialSymbolsOpenInNewRounded from '~icons/material-symbols/open-in-new-rounded';

import H3 from '@/components/typography/h3';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';

import Details from '@/features/edit/edit-content/details';

import useCharacterAnime from '@/services/hooks/characters/use-character-anime';
import useCharacterManga from '@/services/hooks/characters/use-character-manga';
import useCharacterNovel from '@/services/hooks/characters/use-character-novel';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import GeneralCard from './general-card';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.MainContent;
}

const EditContent: FC<Props> = ({ slug, content_type, content }) => {
    const [type, setType] = React.useState<'general' | 'details'>('details');

    let content_parent;
    let parent_link = '#';

    if (content_type === 'character') {
        const { list: animeList } = useCharacterAnime({ slug: slug });
        const { list: mangaList } = useCharacterManga({ slug: slug });
        const { list: novelList } = useCharacterNovel({ slug: slug });

        content_parent =
            animeList?.[0]?.anime ||
            mangaList?.[0]?.manga ||
            novelList?.[0]?.novel;

        parent_link =
            (content_parent &&
                `${CONTENT_TYPE_LINKS[content_parent.data_type]}/${content_parent.slug}`) ||
            '#';
    }

    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    const image = content.data_type === 'anime' ? content.image : content.image;

    return (
        <Block>
            <div className={'flex items-center justify-between gap-2'}>
                <div
                    className={'flex flex-1 items-center gap-4 overflow-hidden'}
                >
                    <Link
                        href={link}
                        target="_blank"
                        className="hover:underline"
                    >
                        <H3>Контент</H3>
                    </Link>
                </div>
                {content_type === 'character' && (
                    <Button size="icon-sm" variant="outline" asChild>
                        <Link href={parent_link! || '#'} target="_blank">
                            <MaterialSymbolsOpenInNewRounded />
                        </Link>
                    </Button>
                )}
                <Button size="icon-sm" variant="outline" asChild>
                    <Link href={link} target="_blank">
                        <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                <GeneralCard
                    image={image}
                    contentType={content_type}
                    title="Інформація"
                    href={link}
                >
                    {content_type === 'character' && (
                        <a className="flex items-center gap-1.5 font-medium ">
                            <MaterialSymbolsArticleOutlineRounded className="size-4 shrink-0 text-muted-foreground" />
                            <Link
                                className="line-clamp-1 text-primary hover:underline"
                                href={parent_link! || '#'}
                            >
                                {content_parent?.title}
                            </Link>
                        </a>
                    )}
                    {(content.data_type === 'anime' ||
                        content.data_type === 'manga' ||
                        content.data_type === 'novel') && (
                        <a className="flex cursor-default items-center gap-1.5 font-medium">
                            <MaterialSymbolsCalendarClockRounded className="size-4 text-muted-foreground" />
                            {content.year}
                        </a>
                    )}
                </GeneralCard>
                <Details content={content} />
            </div>
        </Block>
    );
};

export default EditContent;
