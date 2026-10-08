import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';

const TAB_OPTIONS: Omit<ChipTabOption<MainContentTypeEnum>, 'to'>[] = [
    {
        label: 'Аніме',
        value: ContentTypeEnum.ANIME,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.ANIME],
    },
    {
        label: 'Манґа',
        value: ContentTypeEnum.MANGA,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.MANGA],
    },
    {
        label: 'Ранобе',
        value: ContentTypeEnum.NOVEL,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.NOVEL],
    },
];

type Props = {
    value: MainContentTypeEnum;
    urlFor: (contentType: MainContentTypeEnum) => string;
    className?: string;
};

const ContentTypeTabs: FC<Props> = ({ value, urlFor, className }) => (
    <ChipTabs
        value={value}
        className={className}
        options={TAB_OPTIONS.map((option) => ({
            ...option,
            to: urlFor(option.value),
        }))}
    />
);

export default ContentTypeTabs;
