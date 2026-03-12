import { useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

type State = 'idle' | 'loading' | 'completing';

const PROGRESS_COLOR = '#e779c1';
const START_DELAY = 100;

export default function RouterProgressBar() {
    const isLoading = useRouterState({ select: (s) => s.isLoading });
    const [state, setState] = useState<State>('idle');
    const [progress, setProgress] = useState(0);
    const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // React to router loading state changes
    useEffect(() => {
        if (isLoading) {
            // Delay start to avoid flash on fast navigations
            delayRef.current = setTimeout(() => {
                setProgress(0);
                setState('loading');

                let current = 0;
                trickleRef.current = setInterval(() => {
                    current += (90 - current) * 0.08;
                    setProgress(current);
                }, 200);
            }, START_DELAY);
        } else {
            // Clear pending start delay (navigation finished before bar appeared)
            if (delayRef.current) {
                clearTimeout(delayRef.current);
                delayRef.current = null;
            }

            // Clear trickle interval
            if (trickleRef.current) {
                clearInterval(trickleRef.current);
                trickleRef.current = null;
            }

            // Transition loading → completing (skip if bar never appeared)
            setState((prev) => {
                if (prev === 'loading') {
                    setProgress(100);
                    return 'completing';
                }
                return 'idle';
            });
        }

        return () => {
            if (delayRef.current) {
                clearTimeout(delayRef.current);
                delayRef.current = null;
            }
            if (trickleRef.current) {
                clearInterval(trickleRef.current);
                trickleRef.current = null;
            }
        };
    }, [isLoading]);

    // Completing → idle after fade-out animation
    useEffect(() => {
        if (state !== 'completing') return;

        const timeout = setTimeout(() => {
            setState('idle');
            setProgress(0);
        }, 300);

        return () => clearTimeout(timeout);
    }, [state]);

    if (state === 'idle') return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: PROGRESS_COLOR,
                    transition:
                        state === 'completing'
                            ? 'width 200ms ease, opacity 300ms ease 100ms'
                            : 'width 200ms ease',
                    opacity: state === 'completing' ? 0 : 1,
                    boxShadow: `0 0 10px ${PROGRESS_COLOR}, 0 0 5px ${PROGRESS_COLOR}`,
                }}
            />
        </div>
    );
}
