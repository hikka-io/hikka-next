'use client';

import { Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormSlider, { FormSliderProps } from '@/components/form/form-slider';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { FormLabel } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';

import { useChangeParam } from '@/features/filters';

const SCORE_RANGE: [number, number] = [1, 10];
const DEFAULT_SCORE_MIN = SCORE_RANGE[0];
const DEFAULT_SCORE_MAX = SCORE_RANGE[1];

interface Props {
    className?: string;
    score_type: 'score' | 'native_score';
}

const Score: FC<Props> = ({ score_type }) => {
    const searchParams = useSearchParams()!;

    const scores = searchParams.getAll(score_type);
    const isActive = scores.length > 0;

    const [selectingScores, setSelectingScores] = useState<number[]>(
        scores.length > 0
            ? scores.map(Number)
            : [DEFAULT_SCORE_MIN, DEFAULT_SCORE_MAX],
    );

    const handleChangeParam = useChangeParam();

    useEffect(() => {
        const scoresFromParams = scores.map(Number);
        if (
            JSON.stringify(selectingScores) !== JSON.stringify(scoresFromParams)
        ) {
            setSelectingScores(
                scores.length > 0
                    ? scoresFromParams
                    : [DEFAULT_SCORE_MIN, DEFAULT_SCORE_MAX],
            );
        }
    }, [searchParams]);

    return (
        <CollapsibleFilter
            title="Оцінка"
            icon={<Star className="size-4" />}
            active={isActive}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3">
                    <Slider
                        className="flex-1"
                        onValueCommit={(value) =>
                            handleChangeParam(
                                'score',
                                (value as number[]).map(String),
                            )
                        }
                        onValueChange={(value) =>
                            setSelectingScores(value as number[])
                        }
                        showValue="always"
                        formatValue={(value) => (
                            <div className="flex items-center gap-1">
                                {value}{' '}
                                <MaterialSymbolsStarRounded className="size-3" />
                            </div>
                        )}
                        min={DEFAULT_SCORE_MIN}
                        max={DEFAULT_SCORE_MAX}
                        step={1}
                        minStepsBetweenThumbs={0}
                        value={selectingScores}
                    />
                </div>
            </div>
        </CollapsibleFilter>
    );
};

export const FormScore: FC<Props & Partial<FormSliderProps>> = ({
    score_type,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <FormLabel>Оцінка</FormLabel>
            </div>

            <div className="flex items-center gap-2">
                <FormSlider
                    {...props}
                    name={score_type}
                    min={DEFAULT_SCORE_MIN}
                    max={DEFAULT_SCORE_MAX}
                    step={1}
                    showValue="always"
                    formatValue={(value) => (
                        <div className="flex items-center gap-1">
                            {value}{' '}
                            <MaterialSymbolsStarRounded className="size-3" />
                        </div>
                    )}
                    minStepsBetweenThumbs={0}
                    className="flex-1"
                />
            </div>
        </div>
    );
};

export default Score;
