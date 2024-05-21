'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

interface UseScrollTriggerOptions {
    disableHysteresis?: boolean;
    target?: any;
    threshold?: number;
    getTrigger?: any;
}

function defaultTrigger(store: any, options: UseScrollTriggerOptions) {
    const { disableHysteresis = false, threshold = 100, target } = options;
    const previous = store.current;

    if (target) {
        // Get vertical scroll
        store.current =
            target.pageYOffset !== undefined
                ? target.pageYOffset
                : target.scrollTop;
    }

    if (!disableHysteresis && previous !== undefined) {
        if (store.current < previous) {
            return false;
        }
    }

    return store.current > threshold;
}

const defaultTarget = typeof window !== 'undefined' ? window : null;

export default function useScrollTrigger(
    options: UseScrollTriggerOptions = {},
) {
    const pathname = usePathname();
    const {
        getTrigger = defaultTrigger,
        target = defaultTarget,
        ...other
    } = options;
    const store = React.useRef();
    const [trigger, setTrigger] = React.useState(() =>
        getTrigger(store, other),
    );

    React.useEffect(() => {
        const handleScroll = () => {
            setTrigger(getTrigger(store, { target, ...other }));
        };

        handleScroll(); // Re-evaluate trigger when dependencies change
        target &&
            target.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            target && target.removeEventListener('scroll', handleScroll);
        };
    }, [pathname, target, getTrigger, JSON.stringify(other)]);

    return trigger;
}
