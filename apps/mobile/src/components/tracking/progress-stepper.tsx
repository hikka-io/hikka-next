import { type FC, useState } from 'react';

import { Minus, Plus } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

import { clampInt } from './tracking-body';

type Props = {
    label: string;
    value: number;
    max: number;
    /** Shown as "/ total" after the value when known. */
    total?: number | null;
    onChange: (value: number) => void;
    disabled?: boolean;
};

/** A labelled row with − / + and a typed value, clamped to 0…max. */
const ProgressStepper: FC<Props> = ({
    label,
    value,
    max,
    total,
    onChange,
    disabled,
}) => {
    const [text, setText] = useState<string | null>(null);

    // The draft follows every keystroke, so a save tapped with the keyboard still open sends what is shown.
    const handleChangeText = (next: string) => {
        const parsed = Number.parseInt(next, 10);
        const clamped = clampInt(parsed, 0, max);
        setText(Number.isNaN(parsed) ? '' : String(clamped));
        onChange(clamped);
    };

    const step = (delta: number) => {
        setText(null);
        onChange(clampInt(value + delta, 0, max));
    };

    return (
        <View className="min-h-11 flex-row items-center gap-2">
            <Text className="flex-1 text-base">{label}</Text>
            <Button
                variant="secondary"
                size="icon-sm"
                accessibilityLabel={`${label}: менше`}
                disabled={disabled || value <= 0}
                onPress={() => step(-1)}
            >
                <Icon as={Minus} />
            </Button>
            <View className="flex-row items-center">
                <TextInput
                    accessibilityLabel={label}
                    editable={!disabled}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    selectTextOnFocus
                    maxLength={String(max).length}
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    value={text ?? String(value)}
                    onChangeText={handleChangeText}
                    onBlur={() => setText(null)}
                    className="min-w-10 text-center font-semibold text-base text-foreground"
                />
                {total ? (
                    <Text
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="text-muted-foreground text-sm"
                    >
                        / {total}
                    </Text>
                ) : null}
            </View>
            <Button
                variant="secondary"
                size="icon-sm"
                accessibilityLabel={`${label}: більше`}
                disabled={disabled || value >= max}
                onPress={() => step(1)}
            >
                <Icon as={Plus} />
            </Button>
        </View>
    );
};

export default ProgressStepper;
