import { Fragment, useState } from 'react';

import { BookType, Languages } from 'lucide-react';

import type { CharacterResponse } from '@hikka/api';

import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { useTitle } from '@/utils/title/use-title';

import DetailItem from './detail-item';
import SynonymsModal from './synonyms-modal';

const SynonymsTrigger = ({
    synonyms,
    title,
}: {
    synonyms: string[];
    title?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DetailItem icon={<BookType className="size-4" />} title="Синоніми">
                <button
                    type="button"
                    className="line-clamp-2 w-fit cursor-pointer text-right font-medium text-sm leading-tight hover:underline"
                    onClick={() => setOpen(true)}
                >
                    {synonyms.slice(0, 3).join(', ')}
                </button>
            </DetailItem>
            <SynonymsModal
                description={title}
                synonyms={synonyms}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};

const CharacterDetails = ({
    className,
    data,
}: {
    className?: string;
    data: CharacterResponse;
}) => {
    const title = useTitle(data);

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

export default CharacterDetails;
