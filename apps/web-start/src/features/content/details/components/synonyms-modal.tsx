'use client';

import { FC } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

interface Props {
    synonyms: string[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    description?: string;
}

const SynonymsModal: FC<Props> = ({
    synonyms,
    open,
    onOpenChange,
    description,
}) => {
    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange}>
            <ResponsiveModalContent title="Синоніми" description={description}>
                <div className="-m-4 flex flex-1 flex-col gap-2 overflow-y-scroll p-4">
                    {synonyms.map((item, index) => (
                        <p key={item} className="text-sm">
                            <span className="text-muted-foreground">
                                {index + 1}.{' '}
                            </span>
                            {item}
                        </p>
                    ))}
                </div>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default SynonymsModal;
