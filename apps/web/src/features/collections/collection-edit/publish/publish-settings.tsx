import { type FC, useId } from 'react';

import { Eye, Flag, Layers } from 'lucide-react';

import {
    type CollectionContentTypeEnum,
    CollectionVisibilityEnum,
} from '@hikka/api';
import {
    COLLECTION_CONTENT_TYPE_OPTIONS,
    COLLECTION_VISIBILITY,
} from '@hikka/core';

import { COLLECTION_VISIBILITY_ICONS } from '@/components/icons/collection-visibility-icons';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import OptionSelect from '@/components/option-select';
import type { ChoiceOption } from '@/components/option-summary';
import PanelSection from '@/components/panel-section';
import RadioCards from '@/components/radio-cards';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useCollectionContext } from '../collection-provider';

const TYPE_OPTIONS: ChoiceOption[] = COLLECTION_CONTENT_TYPE_OPTIONS.map(
    ({ value, label }) => ({
        value,
        title: label,
        icon: CONTENT_TYPE_ICONS[value],
    }),
);

const VISIBILITY_HINTS: Record<CollectionVisibilityEnum, string> = {
    [CollectionVisibilityEnum.PUBLIC]: 'Видно всім, є в каталозі колекцій',
    [CollectionVisibilityEnum.UNLISTED]: 'Не показується в каталозі',
    [CollectionVisibilityEnum.PRIVATE]: 'Бачите тільки ви',
};

const VISIBILITY_OPTIONS: ChoiceOption[] = [
    CollectionVisibilityEnum.PUBLIC,
    CollectionVisibilityEnum.UNLISTED,
    CollectionVisibilityEnum.PRIVATE,
].map((value) => ({
    value,
    title: COLLECTION_VISIBILITY[value].label,
    description: VISIBILITY_HINTS[value],
    icon: COLLECTION_VISIBILITY_ICONS[value],
}));

const ContentTypeSection: FC = () => {
    const contentType = useCollectionContext((state) => state.content_type);
    const created = useCollectionContext(
        (state) => state.reference !== undefined,
    );
    const hasItems = useCollectionContext((state) =>
        state.groups.some((group) => group.items.length > 0),
    );
    const setContentType = useCollectionContext(
        (state) => state.setContentType,
    );
    const labelId = useId();

    const lockedHint = created
        ? 'Не змінюється після створення'
        : hasItems
          ? 'Приберіть тайтли, щоб змінити тип'
          : undefined;

    return (
        <PanelSection icon={Layers} title="Тип" labelId={labelId}>
            <OptionSelect
                aria-labelledby={labelId}
                options={TYPE_OPTIONS}
                value={contentType}
                onValueChange={(value) =>
                    setContentType(value as CollectionContentTypeEnum)
                }
                lockedHint={lockedHint}
            />
        </PanelSection>
    );
};

const VisibilitySection: FC = () => {
    const visibility = useCollectionContext((state) => state.visibility);
    const setVisibility = useCollectionContext((state) => state.setVisibility);
    const labelId = useId();

    return (
        <PanelSection icon={Eye} title="Доступ" labelId={labelId}>
            <RadioCards
                aria-labelledby={labelId}
                options={VISIBILITY_OPTIONS}
                value={visibility}
                onValueChange={(value) =>
                    setVisibility(value as CollectionVisibilityEnum)
                }
            />
        </PanelSection>
    );
};

const FlagsSection: FC = () => {
    const spoiler = useCollectionContext((state) => state.spoiler);
    const nsfw = useCollectionContext((state) => state.nsfw);
    const setSpoiler = useCollectionContext((state) => state.setSpoiler);
    const setNsfw = useCollectionContext((state) => state.setNsfw);
    const id = useId();

    return (
        <PanelSection icon={Flag} title="Позначки">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor={`${id}-spoiler`}>Містить спойлери</Label>
                <Switch
                    id={`${id}-spoiler`}
                    checked={spoiler}
                    onCheckedChange={setSpoiler}
                />
            </div>
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor={`${id}-nsfw`}>Контент 18+</Label>
                <Switch
                    id={`${id}-nsfw`}
                    checked={nsfw}
                    onCheckedChange={setNsfw}
                />
            </div>
        </PanelSection>
    );
};

/** The collection settings, shared by the side card and the phone drawer. */
const PublishSettings: FC = () => (
    <>
        <ContentTypeSection />
        <VisibilitySection />
        <FlagsSection />
    </>
);

export default PublishSettings;
