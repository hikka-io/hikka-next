'use client';

import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import { Slider } from '@/components/ui/slider';

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';
import YearFilterInput from '../year-filter-input';

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

    return (
        <CollapsibleFilter title="Рік виходу">
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
        </CollapsibleFilter>
    );
};

export default Year;
