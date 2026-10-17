import {
    type MouseEvent,
    type PointerEvent,
    type RefObject,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
} from 'react';
import { flushSync } from 'react-dom';

const ZOOM_LEVELS = [0.5, 0.67, 0.8, 1, 1.25, 1.5, 2];
const MAX_ZOOM = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
const FRAME_MARGIN = 24;
const DRAG_THRESHOLD = 4;
const WHEEL_SPEED = 0.01;
const MAX_WHEEL_DELTA = 23;
// WheelEvent.deltaMode: pixels, lines (Firefox mouse wheels), pages.
const DELTA_UNITS = [1, 33, 800];

type Point = { x: number; y: number };

export type VisibleBox = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

const touchDistance = (touches: TouchList) =>
    Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
    );

const touchCentre = (touches: TouchList): Point => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
});

export function useGraphZoom(
    scrollRef: RefObject<HTMLDivElement | null>,
    graphRef: RefObject<HTMLDivElement | null>,
    visibleBox: (container: HTMLElement) => VisibleBox,
) {
    const [zoom, setZoom] = useState(1);
    const [minZoom, setMinZoom] = useState(ZOOM_LEVELS[0]);
    const [dragging, setDragging] = useState(false);
    const zoomRef = useRef(1);
    const minZoomRef = useRef(ZOOM_LEVELS[0]);
    const draggedRef = useRef(false);
    const pendingZoomRef = useRef<{ value: number; point: Point } | null>(null);
    const frameRef = useRef(0);

    const clampZoom = (value: number) =>
        Math.min(MAX_ZOOM, Math.max(minZoomRef.current, value));

    /** The zoom at which `target`, measured at the current zoom, fills the visible box. */
    const fitScale = (target: DOMRect, box: VisibleBox) =>
        zoomRef.current *
        Math.min(
            (box.right - box.left - 2 * FRAME_MARGIN) / target.width,
            (box.bottom - box.top - 2 * FRAME_MARGIN) / target.height,
        );

    const zoomTo = (value: number, point?: Point) => {
        const container = scrollRef.current;
        const graph = graphRef.current;
        const previous = zoomRef.current;
        const next = clampZoom(value);
        if (!container || !graph || next === previous) return;

        const box = visibleBox(container);
        const anchor = point ?? {
            x: (box.left + box.right) / 2,
            y: (box.top + box.bottom) / 2,
        };
        const before = graph.getBoundingClientRect();
        const ratio = next / previous;
        const scaledX = (anchor.x - before.left) * ratio;
        const scaledY = (anchor.y - before.top) * ratio;

        zoomRef.current = next;
        flushSync(() => setZoom(next));

        const after = graph.getBoundingClientRect();
        container.scrollLeft += after.left + scaledX - anchor.x;
        container.scrollTop += after.top + scaledY - anchor.y;
    };

    const step = (direction: 1 | -1) => {
        const current = zoomRef.current;
        const levels = [minZoomRef.current, ...ZOOM_LEVELS];
        const level =
            direction > 0
                ? levels.find((value) => value > current + 0.01)
                : levels.reverse().find((value) => value < current - 0.01);
        if (level) zoomTo(level);
    };

    /**
     * Zooms so `target` fits the visible box, never past `cap`, and scrolls its centre to the box's
     * centre. Without a cap the zoom stays as it is.
     */
    const frame = (
        target: DOMRect,
        cap: number | null,
        behavior: ScrollBehavior = 'smooth',
    ) => {
        const container = scrollRef.current;
        const graph = graphRef.current;
        if (!container || !graph) return;

        const box = visibleBox(container);
        const before = graph.getBoundingClientRect();
        const previous = zoomRef.current;
        const centre = {
            x: (target.left + target.width / 2 - before.left) / previous,
            y: (target.top + target.height / 2 - before.top) / previous,
        };
        const next =
            cap === null
                ? previous
                : clampZoom(Math.min(cap, fitScale(target, box)));
        if (next !== previous) {
            zoomRef.current = next;
            flushSync(() => setZoom(next));
        }

        const after = graph.getBoundingClientRect();
        container.scrollBy({
            left: after.left + centre.x * next - (box.left + box.right) / 2,
            top: after.top + centre.y * next - (box.top + box.bottom) / 2,
            behavior: next === previous ? behavior : 'instant',
        });
    };

    const updateMinZoom = useEffectEvent(() => {
        const container = scrollRef.current;
        const graph = graphRef.current;
        if (!container || !graph) return;

        // Rounded, so the graph resizing on every zoom step does not re-render with a new floor.
        const fit = Math.min(
            ZOOM_LEVELS[0],
            Math.floor(
                fitScale(graph.getBoundingClientRect(), visibleBox(container)) *
                    1000,
            ) / 1000,
        );
        minZoomRef.current = fit;
        setMinZoom(fit);
    });

    useEffect(() => {
        const container = scrollRef.current;
        const graph = graphRef.current;
        if (!container || !graph) return;

        const observer = new ResizeObserver(() => updateMinZoom());
        observer.observe(container);
        observer.observe(graph);

        return () => observer.disconnect();
    }, [scrollRef, graphRef]);

    // Wheels and pinches fire faster than frames, so they render the latest zoom once per frame.
    const zoomOnFrame = (scale: number, point: Point) => {
        const base = pendingZoomRef.current?.value ?? zoomRef.current;
        pendingZoomRef.current = { value: clampZoom(base * scale), point };
        if (frameRef.current) return;

        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = 0;
            const pending = pendingZoomRef.current;
            pendingZoomRef.current = null;
            if (pending) zoomTo(pending.value, pending.point);
        });
    };

    const onWheel = useEffectEvent((event: WheelEvent) => {
        if (!event.ctrlKey && !event.metaKey) return;
        event.preventDefault();

        // Capped, so a mouse wheel notch is a step rather than a jump; pinch deltas sit well inside.
        const delta = Math.max(
            -MAX_WHEEL_DELTA,
            Math.min(
                MAX_WHEEL_DELTA,
                event.deltaY * (DELTA_UNITS[event.deltaMode] ?? 1),
            ),
        );
        zoomOnFrame(Math.exp(-delta * WHEEL_SPEED), {
            x: event.clientX,
            y: event.clientY,
        });
    });

    const onPinch = useEffectEvent((touches: TouchList, start: number) => {
        zoomOnFrame(touchDistance(touches) / start, touchCentre(touches));
    });

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let distance = 0;

        const onTouchStart = (event: TouchEvent) => {
            if (event.touches.length === 2) {
                distance = touchDistance(event.touches);
            }
        };
        const onTouchMove = (event: TouchEvent) => {
            if (event.touches.length !== 2 || !distance) return;
            event.preventDefault();
            onPinch(event.touches, distance);
            distance = touchDistance(event.touches);
        };
        const onTouchEnd = (event: TouchEvent) => {
            if (event.touches.length < 2) distance = 0;
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        container.addEventListener('touchstart', onTouchStart, {
            passive: true,
        });
        container.addEventListener('touchmove', onTouchMove, {
            passive: false,
        });
        container.addEventListener('touchend', onTouchEnd);
        container.addEventListener('touchcancel', onTouchEnd);

        return () => {
            container.removeEventListener('wheel', onWheel);
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
            container.removeEventListener('touchend', onTouchEnd);
            container.removeEventListener('touchcancel', onTouchEnd);
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
        };
    }, [scrollRef]);

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;

        const container = event.currentTarget;
        const box = container.getBoundingClientRect();
        const onScrollbar =
            event.clientX - box.left >= container.clientWidth ||
            event.clientY - box.top >= container.clientHeight;
        if (onScrollbar) return;

        const start = {
            x: event.clientX,
            y: event.clientY,
            left: container.scrollLeft,
            top: container.scrollTop,
        };
        let moved = false;

        const onMove = (move: globalThis.PointerEvent) => {
            const dx = move.clientX - start.x;
            const dy = move.clientY - start.y;
            if (!moved) {
                if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
                moved = true;
                setDragging(true);
            }
            container.scrollLeft = start.left - dx;
            container.scrollTop = start.top - dy;
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            if (!moved) return;

            setDragging(false);
            draggedRef.current = true;
            setTimeout(() => {
                draggedRef.current = false;
            });
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    };

    // A drag ends with a click on whatever is under the cursor; it must not select or deselect.
    const onClickCapture = (event: MouseEvent) => {
        if (!draggedRef.current) return;
        draggedRef.current = false;
        event.stopPropagation();
        event.preventDefault();
    };

    return {
        zoom,
        dragging,
        canZoomIn: zoom < MAX_ZOOM,
        canZoomOut: zoom > minZoom + 0.001,
        zoomIn: () => step(1),
        zoomOut: () => step(-1),
        resetZoom: () => zoomTo(1),
        frame,
        panHandlers: {
            onPointerDown,
            onClickCapture,
            onDragStart: (event: MouseEvent) => event.preventDefault(),
        },
    };
}
