import type { HSLColor, UIColorTokens } from '@/types/ui';

import { Label } from '@/components/ui/label';

import ColorTokenButton from './color-token-button';

type TokenGroupProps = {
    title: string;
    tokens: (keyof UIColorTokens)[];
    keyPrefix: string;
    getColor: (token: keyof UIColorTokens) => HSLColor | undefined;
    onColorChange: (token: keyof UIColorTokens, color: HSLColor) => void;
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
