import { useState } from 'react';

import { BookType } from 'lucide-react';

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

export default SynonymsTrigger;
