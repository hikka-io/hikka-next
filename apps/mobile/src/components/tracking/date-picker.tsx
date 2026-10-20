import type { FC } from 'react';

import { DateTimePicker } from '@expo/ui/community/datetime-picker';

export type DatePickerProps = {
    value: Date;
    min?: Date;
    max?: Date;
    accent?: string;
    disabled?: boolean;
    onChange: (date: Date) => void;
    /** Android: the dialog was dismissed without a choice. */
    onDismiss?: () => void;
};

/** Android: the Material date dialog, shown while mounted (`DateField` mounts it on demand). */
const DatePicker: FC<DatePickerProps> = ({
    value,
    min,
    max,
    accent,
    onChange,
    onDismiss,
}) => (
    <DateTimePicker
        value={value}
        mode="date"
        accentColor={accent}
        minimumDate={min}
        maximumDate={max}
        onValueChange={(_, date) => onChange(date)}
        onDismiss={onDismiss}
    />
);

export default DatePicker;
