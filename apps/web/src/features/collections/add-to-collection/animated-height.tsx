import {
    type FC,
    type PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from 'react';

import { cn } from '@/utils/cn';

type Props = PropsWithChildren<{
    className?: string;
}>;

// Base UI resizes a popover with animation only when its trigger payload changes, not when its content swaps views.
const AnimatedHeight: FC<Props> = ({ className, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>();

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver(() =>
            setHeight(element.offsetHeight),
        );
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            style={{ height }}
            className="overflow-hidden transition-[height] duration-200 ease-out motion-reduce:transition-none"
        >
            <div ref={ref} className={cn(className)}>
                {children}
            </div>
        </div>
    );
};

export default AnimatedHeight;
