import { CharacterResponse } from '@hikka/client';
import { BookType, Languages } from 'lucide-react';
import { Fragment } from 'react';

import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';

import DetailItem from './detail-item';

const CharacterDetails = ({
    className,
    data,
}: {
    className?: string;
    data: CharacterResponse;
}) => {
    return (
        <Card
            className={cn('bg-secondary/20 px-0 backdrop-blur', className)}
            id="character-details"
        >
            <div className="flex flex-col gap-4 px-4">
                <DetailItem
                    icon={<Languages className="size-4" />}
                    title="Імʼя англ."
                    value={data.name_en}
                />
                <DetailItem
                    icon={<Languages className="size-4" />}
                    title="Імʼя оригіналу"
                    value={data.name_ja}
                />
            </div>

            {data.synonyms.length > 0 && (
                <Fragment>
                    <Separator />
                    <div className="flex flex-col gap-4 px-4">
                        <DetailItem
                            icon={<BookType className="size-4" />}
                            title="Синоніми"
                            value={data.synonyms}
                        />
                    </div>
                </Fragment>
            )}
        </Card>
    );
};

export default CharacterDetails;
