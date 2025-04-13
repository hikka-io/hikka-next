'use client';

import { cn, withRef } from '@udecode/cn';
import { Children } from 'react';
import { PhotoProvider } from 'react-photo-view';

export const ImageGroupViewElement = withRef<'div'>(
    ({ children, className }, ref) => {
        const mappedChildren = Children.toArray(children);

        return (
            <PhotoProvider>
                <div
                    className={cn(
                        'image-group overflow-hidden rounded-md border mb-4',
                        `image-group-size-${mappedChildren.length}`,
                        className,
                    )}
                >
                    <div className="image-group-container">
                        {mappedChildren.map((child, index) => (
                            <div key={index} className="image-group-item">
                                {child}
                            </div>
                        ))}
                    </div>
                </div>
            </PhotoProvider>
        );
    },
);
