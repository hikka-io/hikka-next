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
const MIN_ZOOM = ZOOM_LEVELS[0];
const MAX_ZOOM = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
const DRAG_THRESHOLD = 4;
const WHEEL_SPEED = 0.01;
const MAX_WHEEL_DELTA = 23;
// WheelEvent.deltaMode: pixels, lines (Firefox mouse wheels), pages.
const DELTA_UNITS = [1, 33, 800];

type Point = { x: number; y: number };

const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

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
) {
    const [zoom, setZoom] = useState(1);
    const [dragging, setDragging] = useState(false);
    const zoomRef = useRef(1);
    const draggedRef = useRef(false);

    const zoomTo = (value: number, point?: Point) => {
        const container = scrollRef.current;
        const graph = graphRef.current;
        const previous = zoomRef.current;
        const next = clampZoom(value);
        if (!container || !graph || next === previous) return;

        const box = container.getBoundingClientRect();
        const anchor = point ?? {
            x: box.left + container.clientWidth / 2,
            y: box.top + container.clientHeight / 2,
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
        const level =
            direction > 0
                ? ZOOM_LEVELS.find((value) => value > current + 0.01)
                : [...ZOOM_LEVELS]
                      .reverse()
                      .find((value) => value < current - 0.01);
        if (level) zoomTo(level);
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
        zoomTo(zoomRef.current * Math.exp(-delta * WHEEL_SPEED), {
            x: event.clientX,
            y: event.clientY,
        });
    });

    const onPinch = useEffectEvent((touches: TouchList, start: number) => {
        zoomTo(
            (zoomRef.current * touchDistance(touches)) / start,
            touchCentre(touches),
        );
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
        canZoomOut: zoom > MIN_ZOOM,
        zoomIn: () => step(1),
        zoomOut: () => step(-1),
        resetZoom: () => zoomTo(1),
        panHandlers: {
            onPointerDown,
            onClickCapture,
            onDragStart: (event: MouseEvent) => event.preventDefault(),
        },
    };
}
