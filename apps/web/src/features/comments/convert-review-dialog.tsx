import { type FC, useEffect, useState } from 'react';

import type { CommentResponse } from '@hikka/api';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';

import CommentVerdictPicker from './comment-verdict-picker';
import { useReviewConversion } from './hooks';
import type { Verdict } from './utils/review';

type Props = {
    comment: CommentResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const ConvertReviewDialog: FC<Props> = ({ comment, open, onOpenChange }) => {
    const [verdict, setVerdict] = useState<Verdict | null>(null);

    const { convert, isPending } = useReviewConversion({
        comment,
        onOpenChange,
        successMessage: 'Коментар перетворено на відгук',
    });

    useEffect(() => {
        if (!open) setVerdict(null);
    }, [open]);

    const handleConfirm = () => {
        if (!verdict) return;
        convert({ recommended: verdict });
    };

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange}>
            <ResponsiveModalContent
                className="md:max-w-md"
                title="Зробити відгуком"
                description="Оберіть вашу оцінку — коментар стане відгуком, текст залишиться без змін."
            >
                <CommentVerdictPicker
                    value={verdict}
                    onChange={setVerdict}
                    bare
                />
                <ResponsiveModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Відмінити
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isPending || !verdict || !comment.text}
                    >
                        Зробити відгуком
                    </Button>
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default ConvertReviewDialog;
