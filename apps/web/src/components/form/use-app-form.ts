import { createFormHook } from '@tanstack/react-form';

import { BadgeFilterField } from './badge-filter-field';
import { DatePickerField } from './date-picker-field';
import { fieldContext, formContext } from './form-context';
import { PasswordField } from './password-field';
import { SelectField } from './select-field';
import { SliderField } from './slider-field';
import { SwitchField } from './switch-field';
import { TextField } from './text-field';
import { TextareaField } from './textarea-field';

export const { useAppForm, useTypedAppFormContext } = createFormHook({
    fieldComponents: {
        TextField,
        TextareaField,
        PasswordField,
        SwitchField,
        SelectField,
        SliderField,
        DatePickerField,
        BadgeFilterField,
    },
    formComponents: {},
    fieldContext,
    formContext,
});
