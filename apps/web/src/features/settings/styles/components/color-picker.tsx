import { useEffect, useState } from 'react';

import { Check, Palette, Pipette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import type { OklchColor } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { hexToOklch, oklchToHex } from '@/utils/ui/color';

import Swatch from './swatch';

const RAINBOW =
    'conic-gradient(from 0deg, #ff5f6d, #ffc371, #7ee8fa, #6a82fb, #b06ab3, #ff5f6d)';

type EyeDropperCtor = new () => {
    open: () => Promise<{ sRGBHex: string }>;
};

const getEyeDropper = (): EyeDropperCtor | undefined =>
    (globalThis as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;

type Props = {
    value: OklchColor;
    /** Whether the current value is a custom pick (not one of the presets). */
    active?: boolean;
    /** Fired continuously while dragging — use for instant preview. */
    onPreview: (color: OklchColor) => void;
    /** Fired once when the popover closes — use to persist. */
    onCommit: (color: OklchColor) => void;
};

const normalizeHex = (hex: string): string =>
    hex.startsWith('#') ? hex : `#${hex}`;

const ColorPicker = ({ value, active, onPreview, onCommit }: Props) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<OklchColor>(value);
    const [hexInput, setHexInput] = useState(() => oklchToHex(value));

    // Keep in sync with external changes (e.g. presets) while closed.
    useEffect(() => {
        if (!open) {
            setDraft(value);
            setHexInput(oklchToHex(value));
        }
    }, [value, open]);

    const applyHex = (next: string) => {
        setHexInput(next);
        const oklch = hexToOklch(normalizeHex(next));
        if (oklch) {
            setDraft(oklch);
            onPreview(oklch);
        }
    };

    const pickFromScreen = async () => {
        const EyeDropper = getEyeDropper();
        if (!EyeDropper) return;
        try {
            const { sRGBHex } = await new EyeDropper().open();
            applyHex(sRGBHex);
        } catch {
            // user dismissed the eyedropper — ignore
        }
    };

    const draftHex = oklchToHex(draft);
    const hasEyeDropper = !!getEyeDropper();

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (next) {
                    setDraft(value);
                    setHexInput(oklchToHex(value));
                } else {
                    onCommit(draft);
                }
            }}
        >
            <PopoverTrigger asChild>
                <Swatch
                    aria-label="Обрати власний колір"
                    title="Власний колір"
                    active={active}
                    style={
                        active
                            ? { backgroundColor: oklchToHex(value) }
                            : { background: RAINBOW }
                    }
                >
                    {active ? <Check /> : <Palette />}
                </Swatch>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="flex w-64 flex-col gap-3 p-3"
            >
                <HexColorPicker color={draftHex} onChange={applyHex} />
                <div className="flex items-center gap-2">
                    {hasEyeDropper && (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Піпетка"
                            onClick={pickFromScreen}
                        >
                            <Pipette className="size-4" />
                        </Button>
                    )}
                    <span
                        className="size-9 shrink-0 rounded-md border"
                        style={{ backgroundColor: draftHex }}
                    />
                    <Input
                        value={hexInput}
                        maxLength={7}
                        spellCheck={false}
                        className="font-mono uppercase"
                        onChange={(event) => applyHex(event.target.value)}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ColorPicker;
