import { type FC, useEffect, useRef, useState } from 'react';

import { Host, Slider } from '@expo/ui';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

import FilterSection from './filter-section';
import { useNativeTint } from './use-native-tint';

const COMMIT_DELAY_MS = 400;

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

    return (
        <View className="gap-3">
            <View className="flex-row justify-between">
                <Text className="text-muted-foreground text-sm">{label}</Text>
                <Text className="font-medium text-sm">{format(value)}</Text>
            </View>
            <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
                <Slider
                    value={value}
                    min={bounds[0]}
                    max={bounds[1]}
                    step={1}
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
    const committed = useRef(range);

    const valueKey = value?.join() ?? '';

    // biome-ignore lint/correctness/useExhaustiveDependencies: re-sync only when the stored range changes, not on a new array identity
    useEffect(() => {
        const next: [number, number] =
            value?.length === 2 ? [value[0], value[1]] : bounds;
        committed.current = next;
        setRange(next);
    }, [valueKey]);

    useEffect(() => {
        if (range.join() === committed.current.join()) return;

        const timer = setTimeout(() => {
            committed.current = range;
            const full = range[0] === bounds[0] && range[1] === bounds[1];
            onChange(full ? null : range);
        }, COMMIT_DELAY_MS);

        return () => clearTimeout(timer);
    }, [range, bounds, onChange]);

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
                onChange={(min) =>
                    setRange(([, max]) => [min, Math.max(min, max)])
                }
            />
            <Thumb
                label="До"
                value={range[1]}
                bounds={bounds}
                format={format}
                onChange={(max) =>
                    setRange(([min]) => [Math.min(min, max), max])
                }
            />
        </FilterSection>
    );
};

export default RangeFilter;
