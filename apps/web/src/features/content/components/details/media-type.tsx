import {
    AnimeMediaEnum,
    ContentTypeEnum,
    MangaMediaEnum,
    NovelMediaEnum,
} from '@hikka/client';
import { FC } from 'react';

import { Label } from '@/components/ui/label';

import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
} from '@/utils/constants/common';

interface Props {
    media_type: AnimeMediaEnum | MangaMediaEnum | NovelMediaEnum | null;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const MediaType: FC<Props> = ({ media_type, content_type }) => {
    if (!media_type) {
        return null;
    }

    const title =
        content_type === ContentTypeEnum.ANIME
            ? ANIME_MEDIA_TYPE[media_type as AnimeMediaEnum].title_ua
            : content_type === ContentTypeEnum.MANGA
              ? MANGA_MEDIA_TYPE[media_type as MangaMediaEnum].title_ua
              : NOVEL_MEDIA_TYPE[media_type as NovelMediaEnum].title_ua;

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Тип:</Label>
            </div>
            <div className="flex-1">
                <Label>{title}</Label>
            </div>
        </div>
    );
};

export default MediaType;
