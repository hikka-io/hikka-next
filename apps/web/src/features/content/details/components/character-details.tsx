import { CharacterResponse } from '@hikka/client';
import { BookType, Languages } from 'lucide-react';

import Card from '@/components/ui/card';

import { cn } from '@/utils/cn';

import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react';
import DetailItem from './detail-item';

const CharacterDetails = ({
    className,
    data,
}: {
    className?: string;
    data: CharacterResponse;
}) => {
    return (
        <Card className={cn('bg-secondary/20 backdrop-blur px-0', className)}>
            <div className='px-4 gap-4 flex flex-col'>
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

            {data.synonyms.length > 0 && <Fragment>
                <Separator />
                <div className='px-4 gap-4 flex flex-col'>
                    <DetailItem
                        icon={<BookType className="size-4" />}
                        title="Синоніми"
                        value={data.synonyms}
                    />
                </div>
            </Fragment>}
        </Card>
    );
};

export default CharacterDetails;
