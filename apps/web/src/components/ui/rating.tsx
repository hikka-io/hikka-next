import {
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    SVGProps,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import MaterialSymbolsStarOutlineRounded from '../icons/material-symbols/MaterialSymbolsStarOutlineRounded';
import MaterialSymbolsStarRounded from '../icons/material-symbols/MaterialSymbolsStarRounded';

interface Props {
    value: number;
    onChange?: (value: number) => void;
    precision?: number;
    totalStars?: number;
    emptyIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
    filledIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
    disabled?: boolean;
    ariaLabel?: string;
    preview?: boolean;
}

const Rating = ({
    onChange,
    value,
    precision = 1,
    totalStars = 5,
    emptyIcon = MaterialSymbolsStarOutlineRounded,
    filledIcon = MaterialSymbolsStarRounded,
    disabled = false,
    ariaLabel = 'Rating',
    preview = false,
}: Props) => {
    const [selected, setSelected] = useState(value);
    const [hoverActiveStar, setHoverActiveStar] = useState(-1);
    const [isHovered, setIsHovered] = useState(false);
    const ratingContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value < 0 || value > totalStars) {
            console.warn(
                `Rating value ${value} is out of range [0, ${totalStars}]`,
            );
        }
    }, [value, totalStars]);

    const calculateRating = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            if (!ratingContainerRef.current) return 0;

            try {
                const { width, left } =
                    ratingContainerRef.current.getBoundingClientRect();
                const percent = (e.clientX - left) / width;

                if (percent < 0.05) {
                    return 0;
                }

                const numberInStars = percent * totalStars;
                const nearestNumber =
                    Math.round((numberInStars + precision / 2) / precision) *
                    precision;

                return Number(
                    nearestNumber.toFixed(
                        precision.toString().split('.')[1]?.length || 0,
                    ),
                );
            } catch (error) {
                console.error('Error calculating rating:', error);
                return 0;
            }
        },
        [totalStars, precision],
    );

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        if (disabled) return;

        if (e.button === 2) {
            e.preventDefault();
            setSelected(0);
            onChange?.(0);
            return;
        }

        setIsHovered(false);
        const current = calculateRating(e);
        setSelected(current);
        onChange?.(current);
    };

    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        if (disabled) return;

        setIsHovered(true);
        setHoverActiveStar(calculateRating(e));
    };

    const handleMouseLeave = () => {
        if (disabled) return;

        setHoverActiveStar(-1);
        setIsHovered(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        const currentValue = isHovered ? hoverActiveStar : selected;

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                e.preventDefault();
                const nextValue = Math.min(
                    currentValue + precision,
                    totalStars,
                );
                setSelected(nextValue);
                onChange?.(nextValue);
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                e.preventDefault();
                const prevValue = Math.max(currentValue - precision, 0);
                setSelected(prevValue);
                onChange?.(prevValue);
                break;
            case 'Home':
                e.preventDefault();
                setSelected(0);
                onChange?.(0);
                break;
            case 'End':
                e.preventDefault();
                setSelected(totalStars);
                onChange?.(totalStars);
                break;
            case 'Delete':
            case 'Backspace':
                e.preventDefault();
                setSelected(0);
                onChange?.(0);
                break;
        }
    };

    const EmptyIcon = emptyIcon;
    const FilledIcon = filledIcon;

    useEffect(() => {
        setSelected(value);
    }, [value]);

    return (
        <div
            role="slider"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={totalStars}
            aria-valuenow={selected}
            aria-valuetext={`${selected} out of ${totalStars} stars`}
            tabIndex={disabled ? -1 : 0}
            className={`relative inline-flex items-center text-left ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            onClick={preview ? undefined : handleClick}
            onContextMenu={preview ? undefined : handleClick}
            onMouseMove={preview ? undefined : handleMouseMove}
            onMouseLeave={preview ? undefined : handleMouseLeave}
            onKeyDown={preview ? undefined : handleKeyDown}
            ref={ratingContainerRef}
        >
            {Array.from({ length: totalStars }, (_, index) => {
                const activeState = isHovered ? hoverActiveStar : selected;
                const showEmptyIcon =
                    activeState === -1 || activeState < index + 1;
                const isStarHovered =
                    isHovered && Math.ceil(hoverActiveStar) === index + 1;
                const showPartialFill =
                    activeState % 1 !== 0 &&
                    Math.ceil(activeState) === index + 1;

                return (
                    <div
                        className="relative cursor-pointer"
                        key={index}
                        role="presentation"
                    >
                        <div className="relative text-2xl transition-transform duration-100 ease-in-out">
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                    width: showPartialFill
                                        ? `${(activeState % 1) * 100}%`
                                        : '0%',
                                }}
                            >
                                <FilledIcon className="text-yellow-400" />
                            </div>
                            <div
                                style={{
                                    color: showEmptyIcon ? 'gray' : 'inherit',
                                }}
                            >
                                {showEmptyIcon ? (
                                    <EmptyIcon />
                                ) : (
                                    <FilledIcon className="text-yellow-400" />
                                )}
                            </div>
                        </div>
                        <style jsx>{`
                            .relative {
                                transform: ${isStarHovered
                                    ? 'scale(1.2)'
                                    : 'scale(1)'};
                                transform-origin: center;
                            }
                        `}</style>
                    </div>
                );
            })}
        </div>
    );
};

export default Rating;
