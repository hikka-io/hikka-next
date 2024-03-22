'use client';

import * as React from 'react';



import Link from 'next/link';



import EntryCard from '@/components/entry-card/entry-card';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';



import { Label } from '../../../../ui/label';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { Button } from '@/components/ui/button';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';


interface Props {
    anime: API.Anime;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const Component = ({ anime, onClick, type }: Props) => {
    const { titleLanguage } = useSettingsContext();

    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            href={'/anime/' + anime.slug}
            onClick={onClick}
            className="flex w-full gap-4 text-left"
        >
            <div className="w-20">
                <EntryCard poster={anime.poster} />
            </div>
            <div className="flex w-full flex-col gap-2">
                <H5>
                    {anime[titleLanguage!] || anime.title_ua || anime.title_en || anime.title_ja}{' '}
                    <Label className="text-muted-foreground">/ {anime.title_ja}</Label>
                </H5>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        {anime.media_type && <div className="flex gap-2">
                            <Label className="text-muted-foreground">Тип:</Label>
                            <Label>
                                {MEDIA_TYPE[anime.media_type].title_ua}
                            </Label>
                        </div>}
                        <div
                            className="w-fit rounded-md px-2 text-sm"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[anime.status].color,
                            }}
                        >
                            <P>{RELEASE_STATUS[anime.status].title_ua}</P>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Label className="text-muted-foreground">Оцінка:</Label>
                        <Label>{anime.score}</Label>
                    </div>
                </div>
            </div>
        </Comp>
    );
};

export default Component;