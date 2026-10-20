import { type FC, useEffect, useRef, useState } from 'react';

import { Host, Slider } from '@expo/ui';
import { useColorScheme, View } from 'react-native';

import { Text } from '@/components/ui/text';

import FilterSection from './filter-section';
import { useNativeTint } from './use-native-tint';

const COMMIT_DELAY_MS = 400;
/** Above this many steps Material draws a dense row of tick marks; the value is rounded anyway. */
const MAX_TICKS = 20;

type Props = {
    title: string;
    bounds: [number, number];
    value?: number[];
    format?: (value: number) => string;
    onChange: (range: [number, number] | null) => void;
};

type ThumbProps = {
    label: string;
    value: number;
    bounds: [number, number];
    format: (value: number) => string;
    onChange: (value: number) => void;
};

const Thumb: FC<ThumbProps> = ({ label, value, bounds, format, onChange }) => {
    const modifiers = useNativeTint();
    const scheme = useColorScheme();

    return (
        <View className="gap-3">
            <View className="flex-row justify-between">
                <Text className="text-muted-foreground text-sm">{label}</Text>
                <Text className="font-medium text-sm">{format(value)}</Text>
            </View>
            <Host
                matchContents={{ vertical: true }}
                colorScheme={scheme === 'dark' ? 'dark' : 'light'}
                style={{ width: '100%' }}
            >
                <Slider
                    value={value}
                    min={bounds[0]}
                    max={bounds[1]}
                    step={bounds[1] - bounds[0] <= MAX_TICKS ? 1 : undefined}
                    modifiers={modifiers}
                    onValueChange={(next) => onChange(Math.round(next))}
                />
            </Host>
        </View>
    );
};

/**
 * The web's two-thumb range slider as two native sliders (neither platform has a native
 * range slider). The full range means "no filter", and changes commit after the drag settles.
 */
const RangeFilter: FC<Props> = ({
    title,
    bounds,
    value,
    format = String,
    onChange,
}) => {
    const [range, setRange] = useState<[number, number]>(
        value?.length === 2 ? [value[0], value[1]] : bounds,
    );
    const pending = useRef<[number, number] | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    });

    const valueKey = value?.join() ?? '';

    // biome-ignore lint/correctness/useExhaustiveDependencies: re-sync only when the stored range changes, not on a new array identity
    useEffect(() => {
        clearTimeout(timer.current);
        pending.current = null;
        setRange(value?.length === 2 ? [value[0], value[1]] : bounds);
    }, [valueKey]);

    const flush = () => {
        clearTimeout(timer.current);
        const next = pending.current;
        if (!next) return;

        pending.current = null;
        const full = next[0] === bounds[0] && next[1] === bounds[1];
        onChangeRef.current(full ? null : next);
    };

    // A change still waiting for the drag to settle is applied when the sheet closes.
    // biome-ignore lint/correctness/useExhaustiveDependencies: flush reads refs only
    useEffect(() => () => flush(), []);

    const update = (next: [number, number]) => {
        setRange(next);
        pending.current = next;
        clearTimeout(timer.current);
        timer.current = setTimeout(flush, COMMIT_DELAY_MS);
    };

    return (
        <FilterSection
            title={title}
            value={`${format(range[0])} – ${format(range[1])}`}
        >
            <Thumb
                label="Від"
                value={range[0]}
                bounds={bounds}
                format={format}
                onChange={(min) => update([min, Math.max(min, range[1])])}
            />
            <Thumb
                label="До"
                value={range[1]}
                bounds={bounds}
                format={format}
                onChange={(max) => update([Math.min(range[0], max), max])}
            />
        </FilterSection>
    );
};

export default RangeFilter;
