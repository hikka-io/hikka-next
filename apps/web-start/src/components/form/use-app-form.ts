import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './form-context';
import { BadgeFilterField } from './form-badge-filter';
import { DatePickerField } from './form-date-picker';
import { TextField } from './form-input';
import { MarkdownField } from './form-markdown';
import { SelectField } from './form-select';
import { SliderField } from './form-slider';
import { SwitchField } from './form-switch';
import { TextareaField } from './form-textarea';

export const { useAppForm, useTypedAppFormContext } = createFormHook({
    fieldComponents: {
        TextField,
        TextareaField,
        SwitchField,
        SelectField,
        SliderField,
        DatePickerField,
        BadgeFilterField,
        MarkdownField,
    },
    formComponents: {},
    fieldContext,
    formContext,
});
