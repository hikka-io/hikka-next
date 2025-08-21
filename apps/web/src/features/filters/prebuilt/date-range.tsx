'use client';

import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import FormSlider, { FormSliderProps } from '@/components/form/form-slider';
import FormSwitch from '@/components/form/form-switch';
import { Badge } from '@/components/ui/badge';

interface Props {
    className?: string;
}

const DEFAULT_DATE_RANGE: [number, number] = [-4, 4];

enum DateRangeEnum {
    PREVIOUS_4_SEASONS = -4,
    PREVIOUS_3_SEASONS = -3,
    PREVIOUS_2_SEASONS = -2,
    PREVIOUS_1_SEASON = -1,
    CURRENT_SEASON = 0,
    NEXT_1_SEASON = 1,
    NEXT_2_SEASONS = 2,
    NEXT_3_SEASONS = 3,
    NEXT_4_SEASONS = 4,
}

const DATE_RANGES: Record<DateRangeEnum, string> = {
    [DateRangeEnum.PREVIOUS_4_SEASONS]: 'Попередні 4 сезони',
    [DateRangeEnum.PREVIOUS_3_SEASONS]: 'Попередні 3 сезони',
    [DateRangeEnum.PREVIOUS_2_SEASONS]: 'Попередні 2 сезони',
    [DateRangeEnum.PREVIOUS_1_SEASON]: 'Попередній сезон',
    [DateRangeEnum.CURRENT_SEASON]: 'Поточний сезон',
    [DateRangeEnum.NEXT_1_SEASON]: 'Наступний сезон',
    [DateRangeEnum.NEXT_2_SEASONS]: 'Наступні 2 сезони',
    [DateRangeEnum.NEXT_3_SEASONS]: 'Наступні 3 сезони',
    [DateRangeEnum.NEXT_4_SEASONS]: 'Наступні 4 сезони',
};

export const FormDateRange: FC<Props & Partial<FormSliderProps>> = (props) => {
    const { watch } = useFormContext();
    const dateRangeEnabled = watch('date_range_enabled');
    const dateRange = watch('date_range');

    return (
        <div className="flex flex-col gap-2">
            <FormSwitch name="date_range_enabled" label="Часовий проміжок" />

            {dateRangeEnabled && (
                <div className="flex flex-col gap-2">
                    {dateRange && (
                        <div className="flex items-center gap-2">
                            <Badge variant="accent">
                                {DATE_RANGES[dateRange[0] as DateRangeEnum]} -{' '}
                                {DATE_RANGES[dateRange[1] as DateRangeEnum]}
                            </Badge>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <FormSlider
                            {...props}
                            name="date_range"
                            defaultValue={dateRange ?? DEFAULT_DATE_RANGE}
                            min={Number(DEFAULT_DATE_RANGE[0])}
                            max={Number(DEFAULT_DATE_RANGE[1])}
                            minStepsBetweenThumbs={0}
                            className="flex-1"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
