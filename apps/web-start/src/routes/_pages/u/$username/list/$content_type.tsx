import { ReadContentType, ReadStatusEnum } from '@hikka/client';
import { searchUserReadsOptions } from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { ReadFilters } from '@/features/read';
import {
    Userlist,
    UserlistHeader,
    UserlistStatusCombobox,
    UserlistToolsCombobox,
    UserlistViewCombobox,
} from '@/features/users';

export const Route = createFileRoute(
    '/_pages/u/$username/list/$content_type',
)({
    validateSearch: (search: Record<string, unknown>) => search as Record<string, any>,
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
        location,
    }) => {
        const { username, content_type } = params;
        const { status, sort } = location.search as {
            status?: string;
            sort?: string;
        };

        if (!status) {
            throw redirect({
                to: '/_pages/u/$username/list/$content_type',
                params: { username, content_type },
                search: { status: 'completed', sort: sort || 'read_score' },
            });
        }

        if (!sort) {
            throw redirect({
                to: '/_pages/u/$username/list/$content_type',
                params: { username, content_type },
                search: { status, sort: 'read_score' },
            });
        }

        await queryClient.prefetchInfiniteQuery(
            searchUserReadsOptions(hikkaClient, {
                username,
                contentType: content_type as ReadContentType,
                args: {
                    read_status: status as ReadStatusEnum,
                    sort: [`${sort}:desc`],
                },
            }) as any,
        );
    },
    head: () => ({
        meta: [{ title: 'Список / Hikka' }],
    }),
    component: ListPage,
});

function ListPage() {
    const { content_type } = Route.useParams();
    const contentType = content_type as ReadContentType;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-12">
            <Block>
                <UserlistHeader content_type={contentType} />
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <UserlistStatusCombobox content_type={contentType} />
                    </div>
                    <div className="flex items-center gap-2">
                        <UserlistViewCombobox />
                        <UserlistToolsCombobox content_type={contentType} />
                    </div>
                </div>
                <Userlist content_type={contentType} />
            </Block>
            <div className="sticky top-20 hidden w-full max-h-[calc(100vh-9rem)] rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden lg:flex">
                <ReadFilters
                    content_type={contentType}
                    sort_type="read"
                />
            </div>
        </div>
    );
}
