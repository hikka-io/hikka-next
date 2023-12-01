import * as React from 'react';
import { RefObject } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

const useSize = (target: RefObject<HTMLElement>) => {
    const [size, setSize] = React.useState<DOMRect>();

    React.useLayoutEffect(() => {
        if (target.current) {
            setSize(target.current.getBoundingClientRect());
        }
    }, [target]);

    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect));
    return size;
};

export default useSize;
