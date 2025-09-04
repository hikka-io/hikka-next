'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import { InputTags } from '@/components/ui/input-tags';

import { useChangeParam } from '@/features/filters';

interface Props {
    className?: string;
}

const Tag: FC<Props> = ({ className }) => {
    const searchParams = useSearchParams()!;

    const tags = searchParams.getAll('tags');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter
            title="Теги"
            className={className}
            active={tags.length > 0}
        >
            <div className="flex flex-col gap-4">
                <InputTags
                    disabled={tags.length === 3}
                    id="tags"
                    value={tags}
                    onChange={(tags) =>
                        handleChangeParam('tags', tags as string[])
                    }
                />
            </div>
        </CollapsibleFilter>
    );
};

export default Tag;
