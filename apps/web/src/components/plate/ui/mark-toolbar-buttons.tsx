import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react';
import { KEYS } from 'platejs';

import { MarkToolbarButton } from './mark-toolbar-button';
import { ToolbarGroup } from './toolbar';

const MARKS = {
    [KEYS.bold]: { icon: BoldIcon, tooltip: 'Жирний (⌘+B)' },
    [KEYS.italic]: { icon: ItalicIcon, tooltip: 'Курсив (⌘+I)' },
    [KEYS.strikethrough]: { icon: StrikethroughIcon, tooltip: 'Закреслений' },
};

export type ToolbarMark = keyof typeof MARKS;

export function MarkToolbarButtons({ marks }: { marks: ToolbarMark[] }) {
    return (
        <ToolbarGroup>
            {marks.map((mark) => {
                const { icon: Icon, tooltip } = MARKS[mark];

                return (
                    <MarkToolbarButton
                        key={mark}
                        nodeType={mark}
                        tooltip={tooltip}
                    >
                        <Icon />
                    </MarkToolbarButton>
                );
            })}
        </ToolbarGroup>
    );
}
