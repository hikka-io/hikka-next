import type { ComponentProps, FC, ReactNode } from 'react';

import ContentHeader from './content-header';

type Props = Omit<ComponentProps<typeof ContentHeader>, 'content_type'> & {
    contentType: ComponentProps<typeof ContentHeader>['content_type'];
    children: ReactNode;
};

const ContentSubpage: FC<Props> = ({ contentType, children, ...header }) => {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col">
            <ContentHeader content_type={contentType} {...header} />
            {/* Contains the cards' z-indexed overlays below the sticky tab strip. */}
            <div className="isolate mt-12 flex flex-col gap-12">{children}</div>
        </div>
    );
};

export default ContentSubpage;
