import { PersonResponse } from '@hikka/client';
import { BookType, Languages } from 'lucide-react';

import Card from '@/components/ui/card';

import { cn } from '@/utils/cn';

import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react';
import DetailItem from './detail-item';

const PersonDetails = ({
    className,
    data,
}: {
    className?: string;
    data: PersonResponse;
}) => {
    return (
        <Card className={cn('bg-secondary/20 px-0 backdrop-blur', className)}>
            <div className='flex flex-col gap-4 px-4'>
                <DetailItem
                    icon={<Languages className="size-4" />}
                    title="Імʼя англ."
                    value={data.name_en}
                />
                <DetailItem
                    icon={<Languages className="size-4" />}
                    title="Імʼя оригіналу"
                    value={data.name_native}
                />
            </div>

            {data.synonyms.length > 0 && <Fragment>
                <Separator />
                <div className='flex flex-col gap-4 px-4'>
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

export default PersonDetails;
