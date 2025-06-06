import { MangaMediaEnum } from '@hikka/client';
import { FC } from 'react';

import { Label } from '@/components/ui/label';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

interface Props {
    media_type: MangaMediaEnum | null;
}

const MediaType: FC<Props> = ({ media_type }) => {
    if (!media_type) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Тип:</Label>
            </div>
            <div className="flex-1">
                <Label>{MANGA_MEDIA_TYPE[media_type].title_ua}</Label>
            </div>
        </div>
    );
};

export default MediaType;
