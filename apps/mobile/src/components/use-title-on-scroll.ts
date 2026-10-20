import { useState } from 'react';

import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

/** The header title of a list page: shown once the hero title's bottom edge has scrolled under the bar. */
export function useTitleOnScroll() {
    const [titleBottom, setTitleBottom] = useState<number | null>(null);
    const [titleVisible, setTitleVisible] = useState(false);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentInset } = event.nativeEvent;
        const past =
            titleBottom !== null &&
            contentOffset.y + contentInset.top > titleBottom;

        if (past !== titleVisible) setTitleVisible(past);
    };

    return { titleVisible, onScroll, onTitleBottom: setTitleBottom };
}
