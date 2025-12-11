import { CharacterResponse } from '@hikka/client';
import { BookType, Languages } from 'lucide-react';

import Card from '@/components/ui/card';

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
        <Card className={cn('bg-secondary/20 backdrop-blur', className)}>
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
            <DetailItem
                icon={<BookType className="size-4" />}
                title="Синоніми"
                value={data.synonyms}
            />
        </Card>
    );
};

export default CharacterDetails;
