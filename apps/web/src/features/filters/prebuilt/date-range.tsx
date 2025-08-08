'use client';

import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import FormSelect, { FormSelectProps } from '@/components/form/form-select';
import FormSwitch from '@/components/form/form-switch';
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
} from '@/components/ui/select';

import { DATE_RANGES, DateRangeEnum } from '@/utils/constants/common';

interface Props {
    className?: string;
}

export const FormDateRange: FC<Props & Partial<FormSelectProps>> = (props) => {
    const { watch } = useFormContext();
    const dateRangeEnabled = watch('date_range_enabled');

    return (
        <div className="flex flex-col gap-2">
            <FormSwitch name="date_range_enabled" label="Часовий проміжок" />
            <div className="flex gap-2">
                <FormSelect
                    {...props}
                    name="date_min_range"
                    placeholder="Від"
                    className="flex-1"
                    disabled={!dateRangeEnabled}
                >
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {Object.values(DateRangeEnum).map((value) => (
                                    <SelectItem key={value} value={value}>
                                        {DATE_RANGES[value].title_ua}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </FormSelect>
                <FormSelect
                    {...props}
                    name="date_max_range"
                    placeholder="До"
                    className="flex-1"
                    disabled={!dateRangeEnabled}
                >
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {Object.values(DateRangeEnum).map((value) => (
                                    <SelectItem key={value} value={value}>
                                        {DATE_RANGES[value].title_ua}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </FormSelect>
            </div>
        </div>
    );
};
