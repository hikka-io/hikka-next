import type { HslColor, UiColorTokens } from '@hikka/api';

import { Label } from '@/components/ui/label';

import ColorTokenButton from './color-token-button';

type TokenGroupProps = {
    title: string;
    tokens: (keyof UiColorTokens)[];
    keyPrefix: string;
    getColor: (token: keyof UiColorTokens) => HslColor | undefined;
    onColorChange: (token: keyof UiColorTokens, color: HslColor) => void;
};

const TokenGroup = ({
    title,
    tokens,
    keyPrefix,
    getColor,
    onColorChange,
}: TokenGroupProps) => (
    <div className="flex flex-col gap-2">
        <Label>{title}</Label>
        <div className="grid w-full grid-cols-2 gap-2">
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
