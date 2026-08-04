import { ContentTypeEnum } from '@hikka/api';

import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';

const CONTENT_TYPES: ChipTabOption<ContentTypeEnum>[] = [
    { value: ContentTypeEnum.ANIME, label: 'Аніме' },
    { value: ContentTypeEnum.MANGA, label: 'Манґа' },
    { value: ContentTypeEnum.NOVEL, label: 'Ранобе' },
    { value: ContentTypeEnum.CHARACTER, label: 'Персонажі' },
    { value: ContentTypeEnum.PERSON, label: 'Люди' },
];

type Props = {
    contentType: ContentTypeEnum;
    onContentTypeChange: (contentType: ContentTypeEnum) => void;
};

export function TodoNavbar({ contentType, onContentTypeChange }: Props) {
    return (
        <div className="surface rounded-md border p-4">
            <ChipTabs
                value={contentType}
                onValueChange={onContentTypeChange}
                options={CONTENT_TYPES}
            />
        </div>
    );
}
