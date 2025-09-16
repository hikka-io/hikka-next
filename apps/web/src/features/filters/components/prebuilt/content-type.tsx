'use client';

import { ContentTypeEnum } from '@hikka/client';
import { Play } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useChangeParam } from '@/features/filters';

import { CONTENT_TYPES } from '@/utils/constants/common';

interface Props {
    className?: string;
    contentTypes: ContentTypeEnum[];
}

const ContentType: FC<Props> = ({ contentTypes }) => {
    const searchParams = useSearchParams()!;

    const content_type = searchParams.get('content_type');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter
            title="Тип контенту"
            icon={<Play className="size-4" />}
            active={!!content_type}
        >
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
