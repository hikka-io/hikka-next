import type { FC } from 'react';
import { useMemo } from 'react';

import { View } from 'react-native';

import { lexMarkdown } from './lexer';
import { renderBlocks } from './render';

type Props = {
    children: string;
    authenticated?: boolean;
    selectable?: boolean;
    className?: string;
    textClassName?: string;
};

const MDViewer: FC<Props> = ({
    children,
    authenticated = false,
    selectable = false,
    className,
    textClassName = 'text-base leading-6 text-foreground',
}) => {
    const tokens = useMemo(() => lexMarkdown(children), [children]);

    return (
        <View className={`gap-4 ${className ?? ''}`}>
            {renderBlocks(tokens, { authenticated, selectable, textClassName })}
        </View>
    );
};

export default MDViewer;
