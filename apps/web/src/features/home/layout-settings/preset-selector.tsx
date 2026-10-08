import type { FC } from 'react';

import { Field, FieldLabel } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/utils/cn';

import { type LayoutPreset, PRESET_META } from '../layout';

const PresetThumbnail: FC<{
    bars: (typeof PRESET_META)[number]['bars'];
    checked: boolean;
}> = ({ bars, checked }) => (
    <div className="flex h-8 w-full items-stretch gap-1">
        {bars.map((bar, i) => (
            <div
                key={i}
                style={{ flex: bar.flex }}
                className={cn(
                    'rounded-(--base-radius) transition-colors',
                    bar.type === 'center'
                        ? checked
                            ? 'bg-primary-foreground/60'
                            : 'bg-primary-foreground/20'
                        : checked
                          ? 'bg-muted-foreground/60'
                          : 'bg-muted-foreground/20',
                )}
            />
        ))}
    </div>
);

type Props = {
    value: LayoutPreset;
    onChange: (preset: LayoutPreset) => void;
};

const PresetSelector: FC<Props> = ({ value, onChange }) => {
    return (
        <RadioGroup
            value={value}
            onValueChange={(v) => onChange(v as LayoutPreset)}
            className="flex gap-2 overflow-x-scroll p-4"
        >
            {PRESET_META.map((preset) => (
                <FieldLabel
                    key={preset.id}
                    className="!rounded-(--base-radius) min-w-32 transition-colors hover:bg-accent"
                >
                    <Field>
                        <RadioGroupItem
                            value={preset.id}
                            id={`preset-${preset.id}`}
                            className="sr-only"
                        />
                        <div className="flex cursor-pointer flex-col items-center gap-2">
                            <PresetThumbnail
                                bars={preset.bars}
                                checked={value === preset.id}
                            />
                            <span
                                className={cn(
                                    'font-medium text-xs leading-tight',
                                    value === preset.id
                                        ? 'text-primary-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {preset.label}
                            </span>
                        </div>
                    </Field>
                </FieldLabel>
            ))}
        </RadioGroup>
    );
};

export default PresetSelector;
