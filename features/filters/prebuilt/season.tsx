'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { SEASON } from '@/utils/constants';

import BadgeFilter from '../badge-filter';
import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
}

const Season: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const seasons = searchParams.getAll('seasons');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter defaultOpen title="Сезон">
            <BadgeFilter
                properties={SEASON}
                selected={seasons}
                property="seasons"
                onParamChange={handleChangeParam}
            />
        </CollapsibleFilter>
    );
};

export default Season;
