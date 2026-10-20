import { type FC, useState } from 'react';

import { type LayoutChangeEvent, View } from 'react-native';

import { MDViewer } from '@/components/markdown';
import { Button } from '@/components/ui/button';

const DEFAULT_LINES = 5;
const DEFAULT_LINE_HEIGHT = 24;

type Props = {
    children: string;
    contentKey: string;
    selectable?: boolean;
    textClassName?: string;
    lines?: number;
    // Must match the line height in `textClassName` (24 for the default `text-base leading-6`).
    lineHeight?: number;
};

const ExpandableMarkdown: FC<Props> = ({
    children,
    contentKey,
    selectable,
    textClassName,
    lines = DEFAULT_LINES,
    lineHeight = DEFAULT_LINE_HEIGHT,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const collapsedHeight = lines * lineHeight;
    const overflows = contentHeight > collapsedHeight + lineHeight;
    const clamped = overflows && !expanded;

    const handleLayout = (event: LayoutChangeEvent) =>
        setContentHeight(event.nativeEvent.layout.height);

    return (
        <View className="gap-1">
            <View
                style={clamped ? { maxHeight: collapsedHeight } : undefined}
                accessibilityElementsHidden={clamped}
                importantForAccessibility={
                    clamped ? 'no-hide-descendants' : 'auto'
                }
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
                    accessibilityLabel={
                        expanded ? 'Згорнути опис' : 'Показати повний опис'
                    }
                    onPress={() => setExpanded((value) => !value)}
                >
                    {expanded ? 'Згорнути' : 'Показати більше'}
                </Button>
            )}
        </View>
    );
};

export default ExpandableMarkdown;
