import { type FC, useContext } from 'react';

import Svg, { Path } from 'react-native-svg';
import { useResolveClassNames } from 'uniwind';

import { IconClassContext } from '@/components/ui/icon';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/utils/cn';

type Props = {
    glyph: string;
    className?: string;
};

// The web's filled status glyphs; colour and size resolve like `Icon` (inherited text and icon classes).
const StatusIcon: FC<Props> = ({ glyph, className }) => {
    const textClass = useContext(TextClassContext);
    const iconClass = useContext(IconClassContext);
    const { color, width } = useResolveClassNames(
        cn('size-4 text-foreground', textClass, iconClass, className),
    );
    const size = typeof width === 'number' ? width : 16;

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
                d={glyph}
                fill={typeof color === 'string' ? color : undefined}
            />
        </Svg>
    );
};

export default StatusIcon;
