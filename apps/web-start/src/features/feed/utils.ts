import { UIFeedWidget, UIFeedWidgetSide } from '@hikka/client';

const COLUMNS: UIFeedWidgetSide[] = ['left', 'center', 'right'];

export function groupBySide(
    widgets: UIFeedWidget[],
): Record<UIFeedWidgetSide, UIFeedWidget[]> {
    const result: Record<UIFeedWidgetSide, UIFeedWidget[]> = {
        left: [],
        center: [],
        right: [],
    };
    for (const w of widgets) {
        result[w.side]?.push(w);
    }
    for (const side of COLUMNS) {
        result[side].sort((a, b) => a.order - b.order);
    }
    return result;
}
