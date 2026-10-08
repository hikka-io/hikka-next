import { ContentTypeEnum } from '@hikka/api';

import { SelectField, useTypedAppFormContext } from '@/components/form';
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
} from '@/components/ui/select';
import { CONTENT_TYPES } from '@/utils/labels/content-types';

import { filterPresetFormOptions } from './filter-preset-form';

// `@hikka/api` enums are const objects, so members are values — not usable in
// type positions. Build the union from the literal value types instead.
type FilterPresetContentType =
    | typeof ContentTypeEnum.ANIME
    | typeof ContentTypeEnum.MANGA
    | typeof ContentTypeEnum.NOVEL;

const FILTER_PRESET_CONTENT_TYPES: FilterPresetContentType[] = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
];

const ContentTypeSelect = ({ disabled }: { disabled?: boolean }) => {
    const form = useTypedAppFormContext(filterPresetFormOptions);

    const handleResetForm = () => {
        setTimeout(() => {
            const contentTypes = form.getFieldValue('content_types');
            const name = form.getFieldValue('name');
            const description = form.getFieldValue('description');
            form.reset();
            form.setFieldValue('content_types', contentTypes);
            form.setFieldValue('name', name);
            form.setFieldValue('description', description);
        }, 0);
    };

    return (
        <form.AppField
            name="content_types"
            children={() => (
                <SelectField
                    label="Тип контенту"
                    placeholder="Виберіть тип контенту"
                    multiple
                    disabled={disabled}
                    onDeselect={handleResetForm}
                    onSelect={handleResetForm}
                >
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {FILTER_PRESET_CONTENT_TYPES.map(
                                    (contentType) => (
                                        <SelectItem
                                            key={contentType}
                                            value={contentType}
                                        >
                                            {
                                                CONTENT_TYPES[contentType]
                                                    .title_ua
                                            }
                                        </SelectItem>
                                    ),
                                )}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </SelectField>
            )}
        />
    );
};

export default ContentTypeSelect;
