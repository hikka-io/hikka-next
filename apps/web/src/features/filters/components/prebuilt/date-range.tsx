'use client';
// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910
'use no memo';

import { CalendarRange } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormSlider, { FormSliderProps } from '@/components/form/form-slider';
import FormSwitch from '@/components/form/form-switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

import { useChangeParam } from '@/features/filters';

import { createQueryString } from '@/utils/url';

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

// TODO: Remove "use no memo" once react-hook-form is compatible with React Compiler
// See: https://github.com/react-hook-form/react-hook-form/issues/11910

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

interface Props {
    className?: string;
}

const DateRange = (props: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const dateRangeEnabled = searchParams.get('date_range_enabled');
    const dateRange = searchParams.getAll('date_range').map(Number);

    const [selectingDateRange, setSelectingDateRange] = useState<number[]>(
        dateRange.length > 0 ? dateRange : DEFAULT_DATE_RANGE,
    );

    const handleChangeParam = useChangeParam();

    const handleChangeDateRangeEnabled = () => {
        const query = createQueryString(
            'date_range_enabled',
            !Boolean(dateRangeEnabled),
            !!Boolean(dateRangeEnabled)
                ? createQueryString(
                      'date_range',
                      [],
                      new URLSearchParams(searchParams),
                  )
                : new URLSearchParams(searchParams),
        );
        router.replace(`${pathname}?${query}`);
    };

    useEffect(() => {
        if (JSON.stringify(selectingDateRange) !== JSON.stringify(dateRange)) {
            setSelectingDateRange(
                dateRange.length > 0 ? dateRange : DEFAULT_DATE_RANGE,
            );
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarRange className="size-4 shrink-0" />
                    <Label htmlFor="date_range_enabled">Часовий проміжок</Label>
                </div>
                <Switch
                    checked={Boolean(dateRangeEnabled)}
                    onCheckedChange={handleChangeDateRangeEnabled}
                    id="date_range_enabled"
                />
            </div>
            {dateRangeEnabled && (
                <div className="flex flex-col gap-2">
                    {dateRange && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                {
                                    DATE_RANGES[
                                        selectingDateRange[0] as DateRangeEnum
                                    ]
                                }{' '}
                                -{' '}
                                {
                                    DATE_RANGES[
                                        selectingDateRange[1] as DateRangeEnum
                                    ]
                                }
                            </Badge>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Slider
                            className="flex-1"
                            onValueCommit={(value) =>
                                handleChangeParam(
                                    'date_range',
                                    (value as number[]).map(String),
                                )
                            }
                            onValueChange={(value) =>
                                setSelectingDateRange(value as number[])
                            }
                            min={Number(DEFAULT_DATE_RANGE[0])}
                            max={Number(DEFAULT_DATE_RANGE[1])}
                            minStepsBetweenThumbs={0}
                            value={selectingDateRange.map((y) => Number(y))}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <CollapsibleFilter
            title="Часовий проміжок"
            icon={<CalendarRange className="size-4" />}
            active={Boolean(dateRangeEnabled)}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <Label
                        className="text-muted-foreground"
                        htmlFor="date_range_enabled"
                    >
                        Часовий проміжок
                    </Label>
                    <Switch
                        checked={Boolean(dateRangeEnabled)}
                        onCheckedChange={handleChangeDateRangeEnabled}
                        id="date_range_enabled"
                    />
                </div>

                {dateRangeEnabled && (
                    <div className="flex flex-col gap-2">
                        {dateRange && (
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    {
                                        DATE_RANGES[
                                            selectingDateRange[0] as DateRangeEnum
                                        ]
                                    }{' '}
                                    -{' '}
                                    {
                                        DATE_RANGES[
                                            selectingDateRange[1] as DateRangeEnum
                                        ]
                                    }
                                </Badge>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Slider
                                className="flex-1"
                                onValueCommit={(value) =>
                                    handleChangeParam(
                                        'date_range',
                                        (value as number[]).map(String),
                                    )
                                }
                                onValueChange={(value) =>
                                    setSelectingDateRange(value as number[])
                                }
                                min={Number(DEFAULT_DATE_RANGE[0])}
                                max={Number(DEFAULT_DATE_RANGE[1])}
                                minStepsBetweenThumbs={0}
                                value={selectingDateRange.map((y) => Number(y))}
                            />
                        </div>
                    </div>
                )}
            </div>
        </CollapsibleFilter>
    );
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
                            <Badge variant="secondary">
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

export default DateRange;
