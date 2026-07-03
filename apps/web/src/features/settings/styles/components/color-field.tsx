import { Check, Sparkles } from 'lucide-react';

import type { OklchColor } from '@hikka/api';

import type { AccentPreset } from '@/utils/constants/styles';
import { oklchToCss, oklchToHex } from '@/utils/ui/color';

import ColorPicker from './color-picker';
import Swatch from './swatch';

type AutoOption = {
    /** Whether the value currently follows the fallback (no explicit color). */
    active: boolean;
    /** Label shown while auto is active (e.g. "Як акцент"). */
    label: string;
    /** The fallback color previewed on the auto swatch. */
    previewColor: OklchColor;
    /** Reset back to auto (clear the explicit color). */
    onSelect: () => void;
};

type Props = {
    /** The effective color shown in the picker + hex readout. */
    value: OklchColor;
    presets: AccentPreset[];
    /** Commit a preset color. */
    onSelect: (color: OklchColor) => void;
    /** Fired continuously while dragging the custom picker — live preview. */
    onPreview: (color: OklchColor) => void;
    /** Fired once when the custom picker closes — persist. */
    onCommit: (color: OklchColor) => void;
    /** Optional "follow the fallback" swatch rendered first. */
    auto?: AutoOption;
};

/**
 * Responsive color control shared by the brand accent and the backdrop glow:
 * a wrapping row of preset swatches + a custom picker on the left, and the
 * active name/hex readout on the right. Stacks vertically on mobile.
 */
const ColorField = ({
    value,
    presets,
    onSelect,
    onPreview,
    onCommit,
    auto,
}: Props) => {
    const autoActive = auto?.active ?? false;
    const valueHex = oklchToHex(value);
    // Match presets by rendered hex, not OKLCH equality: a color picked via
    // the hex input/eyedropper round-trips through hexToOklch with tiny
    // rounding drift, so strict OKLCH comparison would miss its own preset.
    const activePreset = autoActive
        ? undefined
        : presets.find((p) => oklchToHex(p.brand) === valueHex);
    const isCustom = !autoActive && !activePreset;
    const label = autoActive ? auto?.label : (activePreset?.name ?? 'Власний');

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
                {auto && (
                    <Swatch
                        title={auto.label}
                        aria-label={auto.label}
                        active={autoActive}
                        onClick={auto.onSelect}
                        style={{
                            backgroundColor: oklchToCss(auto.previewColor),
                        }}
                    >
                        {autoActive ? <Check /> : <Sparkles />}
                    </Swatch>
                )}
                {presets.map((preset) => {
                    const isActive = preset === activePreset;
                    return (
                        <Swatch
                            key={preset.name}
                            title={preset.name}
                            aria-label={preset.name}
                            active={isActive}
                            onClick={() => onSelect(preset.brand)}
                            style={{
                                backgroundColor: oklchToCss(preset.brand),
                            }}
                        >
                            {isActive && <Check />}
                        </Swatch>
                    );
                })}
                <ColorPicker
                    value={value}
                    active={isCustom}
                    onPreview={onPreview}
                    onCommit={onCommit}
                />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className="rounded-md bg-secondary px-2 py-1 font-mono text-xs">
                    {valueHex}
                </span>
            </div>
        </div>
    );
};

export default ColorField;
