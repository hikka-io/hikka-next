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

import { CONTENT_TYPES } from '@/utils/constants';

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
    contentTypes: API.ContentType[];
}

const ContentType: FC<Props> = ({ contentTypes }) => {
    const searchParams = useSearchParams()!;

    const content_type = searchParams.get('content_type');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter title="Тип контенту">
            <Select
                value={content_type ? [content_type] : undefined}
                onValueChange={(value) =>
                    handleChangeParam('content_type', value[0])
                }
            >
                <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Виберіть тип контенту..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectList>
                        <SelectGroup>
                            {contentTypes.map((item) => (
                                <SelectItem key={item} value={item}>
                                    {CONTENT_TYPES[item].title_ua}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export default ContentType;
