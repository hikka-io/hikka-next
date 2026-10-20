import { type FC, useState } from 'react';

import { type LayoutChangeEvent, View } from 'react-native';

import { MDViewer } from '@/components/markdown';
import { Button } from '@/components/ui/button';

const COLLAPSED_HEIGHT = 120;

type Props = {
    children: string;
    contentKey: string;
    selectable?: boolean;
    textClassName?: string;
};

const ExpandableMarkdown: FC<Props> = ({
    children,
    contentKey,
    selectable,
    textClassName,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const overflows = contentHeight > COLLAPSED_HEIGHT + 24;
    const clamped = overflows && !expanded;

    const handleLayout = (event: LayoutChangeEvent) =>
        setContentHeight(event.nativeEvent.layout.height);

    return (
        <View className="gap-1">
            <View
                style={clamped ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
                className="overflow-hidden"
            >
                <View onLayout={handleLayout}>
                    <MDViewer
                        key={contentKey}
                        selectable={selectable}
                        textClassName={textClassName}
                    >
                        {children}
                    </MDViewer>
                </View>
            </View>
            {overflows && (
                <Button
                    variant="ghost"
                    size="md"
                    containerClassName="self-start"
                    onPress={() => setExpanded((value) => !value)}
                >
                    {expanded ? 'Згорнути' : 'Показати більше'}
                </Button>
            )}
        </View>
    );
};

export default ExpandableMarkdown;
