import { SegmentedControl as NativeSegmentedControl } from '@expo/ui/community/segmented-control';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native';

export type SegmentedOption<T extends string> = { label: string; value: T };

type Props<T extends string> = {
    options: readonly SegmentedOption<T>[];
    value: T;
    onValueChange: (value: T) => void;
};

/**
 * The web's `Tabs`: UISegmentedControl on iOS, Material segmented buttons on Android.
 * Full width with no fixed size, so labels grow with Dynamic Type.
 */
function SegmentedControl<T extends string>({
    options,
    value,
    onValueChange,
}: Props<T>) {
    const scheme = useColorScheme();

    return (
        <NativeSegmentedControl
            values={options.map((option) => option.label)}
            selectedIndex={Math.max(
                0,
                options.findIndex((option) => option.value === value),
            )}
            appearance={scheme === 'dark' ? 'dark' : 'light'}
            onChange={(event) => {
                const next = options[event.nativeEvent.selectedSegmentIndex];

                if (next && next.value !== value) {
                    void Haptics.selectionAsync();
                    onValueChange(next.value);
                }
            }}
        />
    );
}

export default SegmentedControl;
