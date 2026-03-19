'use client';

import { ContentTypeEnum } from '@hikka/client';
import { Play } from 'lucide-react';
import { FC } from 'react';

import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { CONTENT_TYPES } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
    contentTypes: ContentTypeEnum[];
}

const ContentType: FC<Props> = ({ contentTypes }) => {
    const { content_type } = useFilterSearch<{ content_type?: string }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <Play className="size-4 shrink-0" />
                <Label>Тип контенту</Label>
            </div>
            <Select
                value={content_type ? [content_type] : undefined}
                onValueChange={(value) =>
                    handleChangeParam('content_type', value[0])
                }
            >
                <SelectTrigger size="md" className="flex-1">
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
        </div>
    );
};

export default ContentType;
