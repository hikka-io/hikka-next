import React, { JSXElementConstructor, ReactElement, SVGProps, useRef, useState } from 'react';
import MaterialSymbolsStarOutlineRounded from '~icons/material-symbols/star-outline-rounded';
import MaterialSymbolsStarRounded from '~icons/material-symbols/star-rounded';


interface Props {
    value: number;
    onChange: (value: number) => void;
    precision?: number;
    totalStars?: number;
    emptyIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement<any, string | JSXElementConstructor<any>>;
    filledIcon?: (props: SVGProps<SVGSVGElement>) => ReactElement<any, string | JSXElementConstructor<any>>;
}

const Rating = ({
    onChange,
    value,
    precision = 1,
    totalStars = 5,
    emptyIcon = MaterialSymbolsStarOutlineRounded,
    filledIcon = MaterialSymbolsStarRounded,
}: Props) => {
    const [hoverActiveStar, setHoverActiveStar] = useState(-1);
    const [isHovered, setIsHovered] = useState(false);
    const ratingContainerRef = useRef<HTMLDivElement>(null);

    const calculateRating = (e) => {
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

    const handleClick = (e) => {
        setIsHovered(false);
        onChange(calculateRating(e));
    };

    const handleMouseMove = (e) => {
        setIsHovered(true);
        setHoverActiveStar(calculateRating(e));
    };

    const handleMouseLeave = (e) => {
        setHoverActiveStar(-1); // Reset to default state
        setIsHovered(false);
    };
    const EmptyIcon = emptyIcon;
    const FilledIcon = filledIcon;

    return (
        <div
            className="inline-flex relative cursor-pointer text-left"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={ratingContainerRef}
        >
            {[...new Array(totalStars)].map((arr, index) => {
                const activeState = isHovered ? hoverActiveStar : value;

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
                    <div
                        className="relative cursor-pointer"
                        key={index}
                    >
                        <div
                            className="overflow-hidden absolute text-xl"
                            style={{
                                width: showRatingWithPrecision
                                    ? `${(activeState % 1) * 100}%`
                                    : '0%',
                            }}
                        >
                            <FilledIcon />
                        </div>
                        <div
                            className="text-xl"
                            style={{
                                color: showEmptyIcon ? 'gray' : 'inherit',
                            }}
                        >
                            {showEmptyIcon ? <EmptyIcon /> : <FilledIcon />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Rating;