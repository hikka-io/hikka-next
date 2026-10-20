import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { Platform, Switch, View } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { Text } from '@/components/ui/text';

type Props = {
    label: string;
    value?: boolean;
    onChange: (value: boolean) => void;
};

/**
 * React Native's own `Switch` (UISwitch / Material switch) beside our label: an `@expo/ui`
 * host does not center in a row, and its labeled `Switch` crashes Expo Go 57.0.0 on Android.
 */
const SwitchFilter: FC<Props> = ({ label, value = false, onChange }) => {
    const [tint, track] = useCSSVariable([
        '--color-primary-foreground',
        '--color-primary-border',
    ]).map((color) => (typeof color === 'string' ? color : undefined));
    const android = Platform.OS === 'android';

    return (
        <View className="min-h-11 flex-row items-center justify-between gap-4">
            <Text className="flex-1 text-base">{label}</Text>
            <Switch
                accessibilityLabel={label}
                value={value}
                trackColor={{ true: android ? track : tint }}
                thumbColor={android && value ? tint : undefined}
                onValueChange={(next) => {
                    Haptics.selectionAsync();
                    onChange(next);
                }}
            />
        </View>
    );
};

export default SwitchFilter;
