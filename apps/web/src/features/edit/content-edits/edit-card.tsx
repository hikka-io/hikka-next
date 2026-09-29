import { format } from 'date-fns';

import { type EditSimpleResponse, EditStatusEnum } from '@hikka/api';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { EDIT_STATUS } from '@/utils/labels/enum-labels';
import { Link } from '@/utils/navigation';

import { EDIT_PARAMS } from '../edit-params';
import { EDIT_STATUS_STYLE } from '../edit-status-style';

type Props = {
    edit: EditSimpleResponse;
    className?: string;
    href?: string;
    to?: string;
};

const EditCard = ({ edit, href, to, className, ...props }: Props) => {
    const resolvedHref = to ?? href ?? '';
    const statusStyle = EDIT_STATUS_STYLE[edit.status];
    const StatusIcon =
        statusStyle?.icon ?? MaterialSymbolsVisibilityOutlineRounded;

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <HorizontalCard>
                <HorizontalCardImage
                    className="w-10"
                    image={edit.author?.avatar}
                    imageRatio={1}
                    to={`/u/${edit.author?.username}`}
                />
                <HorizontalCardContainer className="shrink-0">
                    <HorizontalCardTitle href={`/u/${edit.author?.username}`}>
                        {edit.author?.username}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription className="line-clamp-1 leading-relaxed">
                        {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>

                <Button
                    size="md"
                    variant={
                        edit.status === EditStatusEnum.CLOSED
                            ? 'outline'
                            : (statusStyle?.variant ?? 'warning')
                    }
                    render={<Link to={resolvedHref} />}
                >
                    <StatusIcon />
                    <span className="hidden md:block">
                        {EDIT_STATUS[edit.status].title_ua}
                    </span>
                </Button>
            </HorizontalCard>
            <div className="flex flex-wrap gap-2 border-l-2 pl-4">
                {Object.keys(edit.after).map(
                    (key) =>
                        key !== 'title' && (
                            <Badge variant="outline" key={key}>
                                {EDIT_PARAMS[key as keyof typeof EDIT_PARAMS]}
                            </Badge>
                        ),
                )}
            </div>
        </div>
    );
};

export default EditCard;
