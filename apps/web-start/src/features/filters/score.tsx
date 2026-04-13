'use client';

import { Star } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { SliderFieldProps, SliderField } from '@/components/form/form-slider';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

const SCORE_RANGE: [number, number] = [1, 10];
const DEFAULT_SCORE_MIN = SCORE_RANGE[0];
const DEFAULT_SCORE_MAX = SCORE_RANGE[1];

interface Props {
    className?: string;
    score_type: 'score' | 'native_score';
}

const Score: FC<Props> = ({ score_type }) => {
    const search = useFilterSearch<Record<string, unknown>>();
    const scores = (search[score_type] as number[] | undefined) ?? [];

    const [selectingScores, setSelectingScores] = useState<number[]>(
        scores.length > 0 ? scores : [DEFAULT_SCORE_MIN, DEFAULT_SCORE_MAX],
    );

    const handleChangeParam = useChangeParam();

    const scoresKey = JSON.stringify(scores);
    useEffect(() => {
        setSelectingScores(
            scores.length > 0 ? scores : [DEFAULT_SCORE_MIN, DEFAULT_SCORE_MAX],
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scoresKey]);

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <Star className="size-4 shrink-0" />
                <Label>Оцінка</Label>
            </div>
            <Slider
                className="flex-1"
                onValueCommit={(value) =>
                    handleChangeParam('score', (value as number[]).map(String))
                }
                onValueChange={(value) => setSelectingScores(value as number[])}
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
    );
};

export const FormScore: FC<Props & Partial<SliderFieldProps>> = ({
    score_type,
    ...props
}) => {
    const form = useTypedAppFormContext({ defaultValues: {} as never });
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Label>Оцінка</Label>
            </div>

            <div className="flex items-center gap-2">
                <form.AppField
                    name={score_type as never}
                    children={() => (
                        <SliderField
                            {...props}
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
                    )}
                />
            </div>
        </div>
    );
};

export default Score;
