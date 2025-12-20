'use client';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import { Button } from '@/components/ui/button';

import { COLOR_PRESETS, ColorPreset } from '@/utils/constants/styles';

interface PresetButtonsProps {
    onPresetSelect: (preset: ColorPreset) => void;
    selectedPresetName: string | null;
}

const PresetButtons = ({
    onPresetSelect,
    selectedPresetName,
}: PresetButtonsProps) => (
    <div>
        <CollapsibleFilter className="" title="Набори">
            <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                    <Button
                        key={preset.name}
                        variant={
                            selectedPresetName === preset.name
                                ? 'default'
                                : 'outline'
                        }
                        size="badge"
                        className="text-left justify-start"
                        onClick={() => onPresetSelect(preset)}
                    >
                        <div
                            className="size-3 rounded-full border"
                            style={{ backgroundColor: preset.color }}
                        />
                        {preset.name}
                    </Button>
                ))}
            </div>
        </CollapsibleFilter>
    </div>
);

export default PresetButtons;

