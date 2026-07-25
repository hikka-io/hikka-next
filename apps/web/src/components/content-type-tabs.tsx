import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';

const CONTENT_TYPES: Omit<ChipTabOption<MainContentTypeEnum>, 'to'>[] = [
    {
        label: 'Аніме',
        value: ContentTypeEnum.ANIME,
        icon: MaterialSymbolsAnimatedImages,
    },
    {
        label: 'Манґа',
        value: ContentTypeEnum.MANGA,
        icon: MaterialSymbolsPalette,
    },
    {
        label: 'Ранобе',
        value: ContentTypeEnum.NOVEL,
        icon: MaterialSymbolsMenuBookRounded,
    },
];

type Props = {
    value: MainContentTypeEnum;
    urlFor: (contentType: MainContentTypeEnum) => string;
    className?: string;
};

/** Anime/manga/novel switcher for list screens that exist per content type. */
const ContentTypeTabs: FC<Props> = ({ value, urlFor, className }) => (
    <ChipTabs
        value={value}
        className={className}
        options={CONTENT_TYPES.map((option) => ({
            ...option,
            to: urlFor(option.value),
        }))}
    />
);

export default ContentTypeTabs;
