'use client';

import { ContentTypeEnum } from '@hikka/client';

import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { SelectField } from '@/components/form/form-select';
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
}: {
    disabled?: boolean;
}) => {
    const form = useTypedAppFormContext({ defaultValues: {} as never });

    const handleResetForm = () => {
        setTimeout(() => {
            const contentTypes = form.getFieldValue('content_types' as never);
            const name = form.getFieldValue('name' as never);
            const description = form.getFieldValue('description' as never);
            form.reset();
            form.setFieldValue('content_types' as never, contentTypes as never);
            form.setFieldValue('name' as never, name as never);
            form.setFieldValue('description' as never, description as never);
        }, 0);
    };

    return (
        <form.AppField
            name={"content_types" as never}
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
                                {FILTER_PRESET_CONTENT_TYPES.map((contentType) => (
                                    <SelectItem key={contentType} value={contentType}>
                                        {CONTENT_TYPES[contentType].title_ua}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </SelectField>
            )}
        />
    );
};

export default ContentTypeSelect;
