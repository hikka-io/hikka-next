import { AnimeAgeRatingEnum } from '@hikka/client';
import { FC } from 'react';

import { Label } from '@/components/ui/label';

import { AGE_RATING } from '@/utils/constants/common';

interface Props {
    rating: AnimeAgeRatingEnum | null;
}

const Rating: FC<Props> = ({ rating }) => {
    if (!rating) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Рейтинг:</Label>
            </div>
            <div className="flex-1">
                <Label>{AGE_RATING[rating].title_ua}</Label>
            </div>
        </div>
    );
};

export default Rating;
