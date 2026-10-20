import { userMentionPath } from '@hikka/core';

import { getSiteUrl } from '@/utils/url';

export const userMentionUrl = (usernameOrReference: string) =>
    `${getSiteUrl()}${userMentionPath(usernameOrReference)}`;
