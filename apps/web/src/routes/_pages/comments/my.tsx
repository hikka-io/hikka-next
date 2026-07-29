import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { requireAuth } from '@/utils/auth';
import { commentsSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/comments/my')({
    validateSearch: zodValidator(commentsSearchSchema),
    beforeLoad: ({ context: { queryClient }, search }) => {
        const session = requireAuth(queryClient);

        if (!session.username) throw redirect({ to: '/login' });

        throw redirect({
            to: '/comments/$content_type/$slug',
            params: {
                content_type: ContentTypeEnum.USER,
                slug: session.username,
            },
            search,
        });
    },
});
