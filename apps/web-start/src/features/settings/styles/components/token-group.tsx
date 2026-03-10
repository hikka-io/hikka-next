'use client';

import { HSLColor, UIColorTokens } from '@hikka/client';

import { Label } from '@/components/ui/label';

import ColorTokenButton from './color-token-button';

interface TokenGroupProps {
    title: string;
    tokens: (keyof UIColorTokens)[];
    keyPrefix: string;
    getColor: (token: keyof UIColorTokens) => HSLColor | undefined;
    onColorChange: (token: keyof UIColorTokens, color: HSLColor) => void;
}

const TokenGroup = ({
    title,
    tokens,
    keyPrefix,
    getColor,
    onColorChange,
}: TokenGroupProps) => (
    <div className="flex flex-col gap-2">
        <Label>{title}</Label>
        <div className="grid grid-cols-2 gap-2 w-full">
            {tokens.map((token) => (
                <ColorTokenButton
                    key={`${keyPrefix}-${token}`}
                    token={token}
                    color={getColor(token)}
                    onColorChange={(color) => onColorChange(token, color)}
                />
            ))}
        </div>
    </div>
);

export default TokenGroup;
