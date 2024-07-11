'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import useModerationLog from '@/services/hooks/moderation/use-moderation-log';
import { convertModerationLog } from '@/utils/convert-moderation-log';
import { cn } from '@/utils/utils';

import TargetType from '../components/target-type';
import useChangeParam from '../components/use-change-params';
import ModerationAuthor from '../components/user';
import HistoryItem from '../edits-block/history-item.component';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const target_type =
        (searchParams.get('target_type') as API.ModerationType) || undefined;
    const order = searchParams.get('log_order') || 'desc';
    const author = searchParams.get('author') || undefined;

    const clearFilters = () => {
        router.replace(`${pathname}`);
    };

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useModerationLog({ target_type, sort: `created:${order}`, author });

    const handleChangeParam = useChangeParam();
    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            <Card className="sticky top-0 mx-4 mb-2 rounded-t-none border-t-0 backdrop-blur-3xl">
                <div className="flex gap-2">
                    <TargetType
                        targetTypes={[
                            'edit_accepted',
                            'edit_denied',
                            'edit_updated',
                            'comment_hidden',
                            'collection_deleted',
                            'collection_updated',
                        ]}
                    />
                    <ModerationAuthor />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                            handleChangeParam(
                                'log_order',
                                order === 'asc' ? 'desc' : 'asc',
                            )
                        }
                    >
                        <MaterialSymbolsSortRounded
                            className={cn(
                                order === 'asc' && ' -scale-y-100',
                                'duration-200',
                            )}
                        />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => clearFilters()}
                    >
                        <AntDesignClearOutlined />
                    </Button>
                </div>
            </Card>
            {list?.map((item) => (
                <HistoryItem
                    className={cn('px-7 py-3', className)}
                    data={convertModerationLog(item)}
                    key={item.reference}
                />
            ))}
            {hasNextPage && (
                <div className="px-4">
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                </div>
            )}
        </div>
    );
};

export default Component;
