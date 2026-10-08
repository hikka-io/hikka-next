import type { FC } from 'react';

import { serializeJsonLd } from '@/utils/json-ld';

type Props = {
    data: object;
};

const JsonLd: FC<Props> = ({ data }) => (
    <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD, escaped by serializeJsonLd so user text cannot close the script tag.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
);

export default JsonLd;
