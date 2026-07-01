import { useEffect, useState } from 'react';

import { Pipette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import type { OklchColor } from '@hikka/api';

import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { hexToOklch, oklchToHex } from '@/utils/ui/color';

const RAINBOW =
    'conic-gradient(from 0deg, #ff5f6d, #ffc371, #7ee8fa, #6a82fb, #b06ab3, #ff5f6d)';

type Props = {
    value: OklchColor;
    /** Whether the current brand comes from a custom pick (not a preset). */
    active?: boolean;
    /** Fired continuously while dragging — use for instant preview. */
    onPreview: (brand: OklchColor) => void;
    /** Fired once when the popover closes — use to persist. */
    onCommit: (brand: OklchColor) => void;
};

const normalizeHex = (hex: string): string =>
    hex.startsWith('#') ? hex : `#${hex}`;

const BrandColorPicker = ({ value, active, onPreview, onCommit }: Props) => {
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
                <button
                    type="button"
                    aria-label="Обрати власний колір"
                    title="Власний колір"
                    data-active={active}
                    className="relative flex size-9 items-center justify-center rounded-md border data-[active=true]:ring-2 data-[active=true]:ring-ring data-[active=true]:ring-offset-1"
                    style={{ background: RAINBOW }}
                >
                    <Pipette className="size-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col gap-3 p-3">
                <HexColorPicker color={oklchToHex(draft)} onChange={applyHex} />
                <Input
                    value={hexInput}
                    maxLength={7}
                    spellCheck={false}
                    onChange={(event) => applyHex(event.target.value)}
                />
            </PopoverContent>
        </Popover>
    );
};

export default BrandColorPicker;
