'use client';

import { useStore } from '@tanstack/react-form';
import { Calendar } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { SliderField, SliderFieldProps } from '@/components/form/form-slider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

import useChangeParam from '../hooks/use-change-param';
import { useFilterSearch } from '../hooks/use-filter-search';
import YearFilterInput from './components/year-filter-input';

const YEARS: [number, number] = [1965, new Date().getFullYear()];
const DEFAULT_YEAR_START = YEARS[0].toString();
const DEFAULT_YEAR_END = YEARS[1].toString();

enum RANGE {
    MIN = 'min',
    MAX = 'max',
}

interface Props {
    className?: string;
}

const Year: FC<Props> = () => {
    const { years: yearsParam = [], date_range_enabled } = useFilterSearch<{
        years?: number[];
        date_range_enabled?: boolean;
    }>();

    const years = yearsParam.map(String);

    const [selectingYears, setSelectingYears] = useState<string[]>(
        years.length > 0 ? years : YEARS.map((y) => String(y)),
    );

    const handleChangeParam = useChangeParam();

    const yearsKey = JSON.stringify(yearsParam);
    useEffect(() => {
        setSelectingYears(
            years.length > 0 ? years : YEARS.map((y) => String(y)),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yearsKey]);

    if (date_range_enabled) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                <Label>Рік виходу</Label>
            </div>
            <div className="flex items-center gap-2">
                <YearFilterInput
                    years={selectingYears}
                    setSelectingYears={setSelectingYears}
                    range={RANGE.MIN}
                    handleChangeParam={handleChangeParam}
                />
                <Slider
                    className="flex-1"
                    onValueCommit={(value) =>
                        handleChangeParam(
                            'years',
                            (value as number[]).map(String),
                        )
                    }
                    onValueChange={(value) =>
                        setSelectingYears((value as number[]).map(String))
                    }
                    min={Number(DEFAULT_YEAR_START)}
                    max={Number(DEFAULT_YEAR_END)}
                    minStepsBetweenThumbs={0}
                    value={selectingYears.map((y) => Number(y))}
                />
                <YearFilterInput
                    years={selectingYears}
                    setSelectingYears={setSelectingYears}
                    range={RANGE.MAX}
                    handleChangeParam={handleChangeParam}
                />
            </div>
        </div>
    );
};

export const FormYear: FC<Props & Partial<SliderFieldProps>> = () => {
    const form = useTypedAppFormContext({ defaultValues: {} as never });
    const years = useStore(form.store, (s) => (s.values as any).years);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Label>Рік виходу</Label>
                {years && (
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {years[0]} - {years[1]}
                        </Badge>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <form.AppField
                    name={"years" as never}
                    children={() => (
                        <SliderField
                            min={Number(DEFAULT_YEAR_START)}
                            max={Number(DEFAULT_YEAR_END)}
                            minStepsBetweenThumbs={0}
                            className="flex-1"
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default Year;
