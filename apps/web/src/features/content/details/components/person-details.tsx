import { Fragment, useState } from 'react';

import { BookType, Languages } from 'lucide-react';

import type { PersonResponse } from '@hikka/api';

import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTitle } from '@/features/auth/hooks/use-title';
import { cn } from '@/utils/cn';

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

const PersonDetails = ({
    className,
    data,
}: {
    className?: string;
    data: PersonResponse;
}) => {
    const title = useTitle(data);

    return (
        <Card className={cn('px-0', className)} id="person-details">
            <div className="flex flex-col gap-4 px-4">
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

export default PersonDetails;
