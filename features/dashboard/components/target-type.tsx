'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { MODERATION_TYPES } from '@/utils/constants';

import useChangeParam from './use-change-params';

interface Props {
    targetTypes: API.ModerationType[];
}

const TargetType: FC<Props> = ({ targetTypes }) => {
    const searchParams = useSearchParams()!;

    const target_type = searchParams.get('target_type');

    const handleChangeParam = useChangeParam();

    return (
        <Select
            value={target_type ? [target_type] : undefined}
            onValueChange={(value) =>
                handleChangeParam('target_type', value[0])
            }
        >
            <SelectTrigger className="flex-1">
                <SelectValue placeholder="Тип модерації" />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {targetTypes.map((item) => (
                            <SelectItem key={item} value={item}>
                                {MODERATION_TYPES[item].title_ua}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default TargetType;
