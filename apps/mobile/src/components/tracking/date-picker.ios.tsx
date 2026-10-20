import type { FC } from 'react';

import { Host, DatePicker as SwiftDatePicker } from '@expo/ui/swift-ui';
import {
    datePickerStyle,
    disabled as disabledModifier,
    environment,
    frame,
    tint,
} from '@expo/ui/swift-ui/modifiers';

import type { DatePickerProps } from './date-picker';

// The host fills the rest of the row (it has no Yoga size of its own); the compact pill sits trailing.
const DatePicker: FC<DatePickerProps> = ({
    value,
    min,
    max,
    accent,
    disabled,
    onChange,
}) => (
    <Host style={{ flex: 1, height: 44 }} ignoreSafeArea="all">
        <SwiftDatePicker
            title=""
            selection={value}
            displayedComponents={['date']}
            range={min || max ? { start: min, end: max } : undefined}
            onDateChange={onChange}
            modifiers={[
                datePickerStyle('compact'),
                environment('locale', 'uk_UA'),
                frame({ maxWidth: 10000, alignment: 'trailing' }),
                ...(accent ? [tint(accent)] : []),
                ...(disabled ? [disabledModifier(true)] : []),
            ]}
        />
    </Host>
);

export default DatePicker;
