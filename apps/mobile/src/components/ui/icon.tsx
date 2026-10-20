import { createContext, type FC, useContext } from 'react';

import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { useResolveClassNames } from 'uniwind';

import { cn } from '@/utils/cn';

import { TextClassContext } from './text';

const IconClassContext = createContext<string | undefined>(undefined);

type Props = Omit<LucideProps, 'color' | 'size'> & {
    as: LucideIcon;
    className?: string;
};

const DEFAULT_SIZE = 16;

const Icon: FC<Props> = ({ as: Glyph, className, ...props }) => {
    const textClass = useContext(TextClassContext);
    const iconClass = useContext(IconClassContext);
    const { color, width } = useResolveClassNames(
        cn('size-4 text-foreground', textClass, iconClass, className),
    );

    return (
        <Glyph
            color={typeof color === 'string' ? color : undefined}
            size={typeof width === 'number' ? width : DEFAULT_SIZE}
            {...props}
        />
    );
};

export { Icon, IconClassContext };
