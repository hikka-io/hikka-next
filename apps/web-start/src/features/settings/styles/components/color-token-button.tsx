'use client';

import { HSLColor } from '@hikka/client';
import { useEffect, useState } from 'react';
import { HslColor, HslColorPicker } from 'react-colorful';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverPortal,
    PopoverTrigger,
} from '@/components/ui/popover';

import { COLOR_TOKEN_LABELS } from '@/utils/constants/styles';
import {
    formatHSL,
    hexToHsl,
    hslToHex,
    toHSLString,
    toHikkaColor,
    toReactColorful,
} from '@/utils/ui/color';

interface ColorTokenButtonProps {
    token: keyof typeof COLOR_TOKEN_LABELS;
    color: HSLColor | undefined;
    onColorChange: (color: HSLColor) => void;
}

const ColorTokenButton = ({
    token,
    color,
    onColorChange,
}: ColorTokenButtonProps) => {
    const [localColor, setLocalColor] = useState<HslColor>(
        toReactColorful(color),
    );
    const [hexInput, setHexInput] = useState(
        hslToHex(localColor.h, localColor.s, localColor.l),
    );
    const [inputMode, setInputMode] = useState<'hex' | 'hsl'>('hex');

    useEffect(() => {
        const newColor = toReactColorful(color);
        setLocalColor(newColor);
        setHexInput(hslToHex(newColor.h, newColor.s, newColor.l));
    }, [color?.h, color?.s, color?.l]);

    const handleChange = (newColor: HslColor) => {
        setLocalColor(newColor);
        setHexInput(hslToHex(newColor.h, newColor.s, newColor.l));
    };

    const handleChangeComplete = () => {
        onColorChange(toHikkaColor(localColor));
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHexInput(value);

        const normalizedHex = value.startsWith('#') ? value : `#${value}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(normalizedHex)) {
            const hsl = hexToHsl(normalizedHex);
            if (hsl) {
                setLocalColor(hsl);
                onColorChange(toHikkaColor(hsl));
            }
        }
    };

    const handleHexBlur = () => {
        setHexInput(hslToHex(localColor.h, localColor.s, localColor.l));
    };

    const handleHslChange = (key: 'h' | 's' | 'l', value: string) => {
        const num = parseInt(value, 10);
        if (isNaN(num)) return;

        const max = key === 'h' ? 360 : 100;
        const clamped = Math.max(0, Math.min(max, num));
        const newColor = { ...localColor, [key]: clamped };

        setLocalColor(newColor);
        setHexInput(hslToHex(newColor.h, newColor.s, newColor.l));
        onColorChange(toHikkaColor(newColor));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="justify-start overflow-hidden text-left"
                >
                    <div
                        className="size-8 shrink-0 rounded-md border"
                        style={{ backgroundColor: toHSLString(color) }}
                    />
                    <div className="flex flex-1 flex-col truncate">
                        <span className="truncate">
                            {COLOR_TOKEN_LABELS[token]}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {formatHSL(color) ?? 'Не вибрано'}
                        </span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent className="z-999 min-w-80 p-4">
                    <div className="flex w-full flex-col gap-4">
                        <HslColorPicker
                            className="w-full!"
                            color={localColor}
                            onChange={handleChange}
                            onMouseUp={handleChangeComplete}
                            onTouchEnd={handleChangeComplete}
                        />
                        <div className="flex w-full items-center gap-2">
                            <Button
                                variant="outline"
                                size="md"
                                className="shrink-0 font-mono"
                                onClick={() =>
                                    setInputMode(
                                        inputMode === 'hex' ? 'hsl' : 'hex',
                                    )
                                }
                            >
                                {inputMode === 'hex' ? 'HEX' : 'HSL'}
                            </Button>
                            {inputMode === 'hex' ? (
                                <Input
                                    value={hexInput}
                                    onChange={handleHexChange}
                                    onBlur={handleHexBlur}
                                    placeholder="#000000"
                                    className="h-10 flex-1 font-mono uppercase"
                                    maxLength={7}
                                />
                            ) : (
                                <div className="flex flex-1 gap-2">
                                    <Input
                                        value={Math.round(localColor.h)}
                                        onChange={(e) =>
                                            handleHslChange('h', e.target.value)
                                        }
                                        placeholder="H"
                                        className="h-10 text-center font-mono "
                                        type="number"
                                        min={0}
                                        max={360}
                                    />
                                    <Input
                                        value={Math.round(localColor.s)}
                                        onChange={(e) =>
                                            handleHslChange('s', e.target.value)
                                        }
                                        placeholder="S"
                                        className="h-10 text-center font-mono"
                                        type="number"
                                        min={0}
                                        max={100}
                                    />
                                    <Input
                                        value={Math.round(localColor.l)}
                                        onChange={(e) =>
                                            handleHslChange('l', e.target.value)
                                        }
                                        placeholder="L"
                                        className="h-10 text-center font-mono "
                                        type="number"
                                        min={0}
                                        max={100}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    );
};

export default ColorTokenButton;
