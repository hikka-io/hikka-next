'use client';

import * as React from 'react';



import Link from 'next/link';



import BaseCard from '@/app/_components/ui/base-card';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/app/_utils/constants';



import { Label } from '../../../../ui/label';
import { useSettingsContext } from '@/app/_utils/providers/settings-provider';


interface Props {
    anime: Hikka.Anime;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const Component = ({ anime, onClick }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return (
        <Link
            href={'/anime/' + anime.slug}
            onClick={onClick}
            className="flex w-full gap-4"
        >
            <div className="w-20">
                <BaseCard poster={anime.poster} />
            </div>
            <div className="flex w-full flex-col gap-2">
                <h5>
                    {anime[titleLanguage!] || anime.title_ua || anime.title_en || anime.title_ja}{' '}
                    <Label className="text-muted-foreground">/ {anime.title_ja}</Label>
                </h5>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        {anime.media_type && <div className="flex gap-2">
                            <Label className="text-sm text-muted-foreground">Тип:</Label>
                            <Label className="text-sm">
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
                            <p>{RELEASE_STATUS[anime.status].title_ua}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Label className="text-sm text-muted-foreground">Оцінка:</Label>
                        <Label className="text-sm">{anime.score}</Label>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Component;