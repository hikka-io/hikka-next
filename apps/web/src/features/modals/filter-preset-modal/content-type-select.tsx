'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useFormContext } from 'react-hook-form';

import FormSelect from '@/components/form/form-select';
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
} from '@/components/ui/select';

import { CONTENT_TYPES } from '@/utils/constants/common';

type FilterPresetContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;

const FILTER_PRESET_CONTENT_TYPES: FilterPresetContentType[] = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
];

const ContentTypeSelect = ({
    disabled,
    defaultValues,
}: {
    disabled?: boolean;
    defaultValues: Record<string, any>;
}) => {
    const { reset, watch } = useFormContext();

    const content_types = watch('content_types');
    const name = watch('name');
    const description = watch('description');

    const handleResetForm = (value: string) => {
        reset({
            ...defaultValues,
            content_types: content_types,
            name: name,
            description: description,
        });
    };

    return (
        <FormSelect
            name="content_types"
            label="Тип контенту"
            placeholder="Виберіть тип контенту"
            multiple
            disabled={disabled}
            onDeselect={handleResetForm}
            onSelect={handleResetForm}
            options={FILTER_PRESET_CONTENT_TYPES.map((contentType) => ({
                label: CONTENT_TYPES[contentType].title_ua,
                value: contentType,
            }))}
        >
            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {FILTER_PRESET_CONTENT_TYPES.map((contentType) => (
                            <SelectItem key={contentType} value={contentType}>
                                {CONTENT_TYPES[contentType].title_ua}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </FormSelect>
    );
};

export default ContentTypeSelect;
