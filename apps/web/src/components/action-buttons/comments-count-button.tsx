import type { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { COMMENT_FORMS } from '@/utils/i18n/word-forms';
import { Link } from '@/utils/navigation';

type Props = {
    to: string;
    count?: number;
    iconClassName?: string;
};

const CommentsCountButton: FC<Props> = ({ to, count, iconClassName }) => {
    return (
        <Button size="md" variant="ghost" render={<Link to={to} />}>
            <MessageCircle className={iconClassName} />
            <span>
                {count}{' '}
                <span className="hidden sm:inline">
                    {getDeclensionWord(count ?? 0, COMMENT_FORMS)}
                </span>
            </span>
        </Button>
    );
};

export default CommentsCountButton;
