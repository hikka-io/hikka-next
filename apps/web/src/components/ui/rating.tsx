import {
    MouseEvent,
    ReactElement,
    SVGProps,
    useEffect,
    useRef,
    useState,
} from 'react';

import MaterialSymbolsStarOutlineRounded from '../icons/material-symbols/MaterialSymbolsStarOutlineRounded';
import MaterialSymbolsStarRounded from '../icons/material-symbols/MaterialSymbolsStarRounded';

interface Props {
    value: number;
    onChange: (value: number) => void;
    precision?: number;
    totalStars?: number;
    emptyIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
    filledIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
}

const Rating = ({
    onChange,
    value,
    precision = 1,
    totalStars = 5,
    emptyIcon = MaterialSymbolsStarOutlineRounded,
    filledIcon = MaterialSymbolsStarRounded,
}: Props) => {
    const [selected, setSelected] = useState(value);
    const [hoverActiveStar, setHoverActiveStar] = useState(-1);
    const [isHovered, setIsHovered] = useState(false);
    const ratingContainerRef = useRef<HTMLDivElement>(null);

    const calculateRating = (e: MouseEvent<HTMLElement>) => {
        const { width, left } =
            ratingContainerRef.current!.getBoundingClientRect();
        let percent = (e.clientX - left) / width;
        const numberInStars = percent * totalStars;
        const nearestNumber =
            Math.round((numberInStars + precision / 2) / precision) * precision;

        return Number(
            nearestNumber.toFixed(
                precision.toString().split('.')[1]?.length || 0,
            ),
        );
    };

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        setIsHovered(false);

        const current = calculateRating(e);

        setSelected(current);
        onChange(current);
    };

    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        setIsHovered(true);
        setHoverActiveStar(calculateRating(e));
    };

    const handleMouseLeave = () => {
        setHoverActiveStar(-1); // Reset to default state
        setIsHovered(false);
    };
    const EmptyIcon = emptyIcon;
    const FilledIcon = filledIcon;

    useEffect(() => {
        setSelected(value);
    }, [value]);

    return (
        <div
            className="relative inline-flex cursor-pointer items-center text-left"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={ratingContainerRef}
        >
            {[...new Array(totalStars)].map((_, index) => {
                const activeState = isHovered ? hoverActiveStar : selected;

                const showEmptyIcon =
                    activeState === -1 || activeState < index + 1;

                const isActiveRating = activeState !== 1;
                const isRatingWithPrecision = activeState % 1 !== 0;
                const isRatingEqualToIndex =
                    Math.ceil(activeState) === index + 1;
                const showRatingWithPrecision =
                    isActiveRating &&
                    isRatingWithPrecision &&
                    isRatingEqualToIndex;

                return (
                    <div className="relative cursor-pointer" key={index}>
                        <div
                            className="absolute overflow-hidden text-2xl"
                            style={{
                                width: showRatingWithPrecision
                                    ? `${(activeState % 1) * 100}%`
                                    : '0%',
                            }}
                        >
                            <FilledIcon className="text-yellow-400 " />
                        </div>
                        <div
                            className="text-2xl"
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
                );
            })}
        </div>
    );
};

export default Rating;
