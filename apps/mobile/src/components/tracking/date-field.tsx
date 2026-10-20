import { type FC, useState } from 'react';

import { X } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

import DatePicker from './date-picker';
import { localDateToUnix, unixToLocalDate } from './tracking-body';

type Props = {
    label: string;
    /** UTC-midnight unix seconds, or null when unset. */
    value: number | null;
    onChange: (value: number | null) => void;
    min?: number | null;
    max?: number | null;
    disabled?: boolean;
};

const IS_ANDROID = Platform.OS === 'android';

const formatDate = (unix: number) =>
    unixToLocalDate(unix).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

const clampToday = (min?: number | null, max?: number | null) => {
    const today = localDateToUnix(new Date());
    if (min != null && today < min) return min;
    if (max != null && today > max) return max;
    return today;
};

const toDate = (unix?: number | null) =>
    unix == null ? undefined : unixToLocalDate(unix);

/** A nullable date: the native picker (compact on iOS, a dialog on Android) plus a clear button. */
const DateField: FC<Props> = ({
    label,
    value,
    onChange,
    min,
    max,
    disabled,
}) => {
    const accent = useCSSVariable('--color-primary-foreground');
    const [dialogOpen, setDialogOpen] = useState(false);

    const picker = (
        <DatePicker
            value={unixToLocalDate(value ?? clampToday(min, max))}
            min={toDate(min)}
            max={toDate(max)}
            accent={typeof accent === 'string' ? accent : undefined}
            disabled={disabled}
            onChange={(date) => {
                setDialogOpen(false);
                onChange(localDateToUnix(date));
            }}
            onDismiss={() => setDialogOpen(false)}
        />
    );

    return (
        <View className="min-h-11 flex-row items-center gap-2">
            <Text
                className={cn(
                    'text-base',
                    (IS_ANDROID || value == null) && 'flex-1',
                )}
            >
                {label}
            </Text>
            {value == null ? (
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={disabled}
                    onPress={() =>
                        IS_ANDROID
                            ? setDialogOpen(true)
                            : onChange(clampToday(min, max))
                    }
                >
                    Вказати
                </Button>
            ) : (
                <>
                    {IS_ANDROID ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={disabled}
                            onPress={() => setDialogOpen(true)}
                        >
                            {formatDate(value)}
                        </Button>
                    ) : (
                        picker
                    )}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        accessibilityLabel={`${label}: очистити`}
                        disabled={disabled}
                        onPress={() => onChange(null)}
                    >
                        <Icon as={X} className="text-muted-foreground" />
                    </Button>
                </>
            )}
            {IS_ANDROID && dialogOpen && picker}
        </View>
    );
};

export default DateField;
