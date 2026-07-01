import { useEffect, useState } from 'react';

import { HexColorPicker } from 'react-colorful';

import type { OklchColor } from '@hikka/api';

import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { hexToOklch, oklchToHex } from '@/utils/ui/color';

type Props = {
    value: OklchColor;
    /** Fired continuously while dragging — use for instant preview. */
    onPreview: (brand: OklchColor) => void;
    /** Fired once when the popover closes — use to persist. */
    onCommit: (brand: OklchColor) => void;
};

const normalizeHex = (hex: string): string =>
    hex.startsWith('#') ? hex : `#${hex}`;

const BrandColorPicker = ({ value, onPreview, onCommit }: Props) => {
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
                    aria-label="Обрати колір бренду"
                    className="size-9 rounded-md border"
                    style={{ backgroundColor: oklchToHex(draft) }}
                />
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
