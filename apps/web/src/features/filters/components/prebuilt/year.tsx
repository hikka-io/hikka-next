'use client';
// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910
'use no memo';

import { Calendar } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormSlider, { FormSliderProps } from '@/components/form/form-slider';
import { Badge } from '@/components/ui/badge';
import { FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

import { useChangeParam } from '@/features/filters';

import YearFilterInput from '../year-filter-input';

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

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
    const searchParams = useSearchParams()!;

    const years = searchParams.getAll('years');
    const dateRangeEnabled = searchParams.get('date_range_enabled');

    const [selectingYears, setSelectingYears] = useState<string[]>(
        years.length > 0 ? years : YEARS.map((y) => String(y)),
    );

    const handleChangeParam = useChangeParam();

    useEffect(() => {
        if (JSON.stringify(selectingYears) !== JSON.stringify(years)) {
            setSelectingYears(
                years.length > 0 ? years : YEARS.map((y) => String(y)),
            );
        }
    }, [searchParams]);

    if (dateRangeEnabled) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
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

    return (
        <CollapsibleFilter
            title="Рік виходу"
            icon={<Calendar className="size-4" />}
            active={years.length > 0}
        ></CollapsibleFilter>
    );
};

export const FormYear: FC<Props & Partial<FormSliderProps>> = (props) => {
    const { watch } = useFormContext();

    const years = watch('years');

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <FormLabel>Рік виходу</FormLabel>
                {years && (
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {years[0]} - {years[1]}
                        </Badge>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <FormSlider
                    {...props}
                    name="years"
                    min={Number(DEFAULT_YEAR_START)}
                    max={Number(DEFAULT_YEAR_END)}
                    minStepsBetweenThumbs={0}
                    className="flex-1"
                />
            </div>
        </div>
    );
};

export default Year;
