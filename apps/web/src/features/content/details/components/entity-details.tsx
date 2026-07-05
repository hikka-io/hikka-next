import { Fragment } from 'react';

import { Languages } from 'lucide-react';

import type { CharacterResponse, PersonResponse } from '@hikka/api';

import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTitle } from '@/features/auth/hooks/use-title';
import { cn } from '@/utils/cn';

import DetailItem from './detail-item';
import SynonymsTrigger from './synonyms-trigger';

const EntityDetails = ({
    className,
    data,
    entityType,
}: {
    className?: string;
    data: CharacterResponse | PersonResponse;
    entityType: 'character' | 'person';
}) => {
    const title = useTitle(data);
    const originalName =
        entityType === 'character'
            ? (data as CharacterResponse).name_ja
            : (data as PersonResponse).name_native;

    return (
        <Card className={cn('px-0', className)} id={`${entityType}-details`}>
            <div className="flex flex-col gap-4 px-4">
                <DetailItem
                    icon={<Languages className="size-4" />}
                    title="Імʼя англ."
                    value={data.name_en}
                />
                <DetailItem
                    icon={<Languages className="size-4" />}
                    title="Імʼя оригіналу"
                    value={originalName}
                />
            </div>

            {data.synonyms.length > 0 && (
                <Fragment>
                    <Separator />
                    <div className="flex flex-col gap-4 px-4">
                        <SynonymsTrigger
                            title={title}
                            synonyms={data.synonyms}
                        />
                    </div>
                </Fragment>
            )}
        </Card>
    );
};

export default EntityDetails;
