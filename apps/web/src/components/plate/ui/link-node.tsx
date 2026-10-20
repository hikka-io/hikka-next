import { getLinkAttributes } from '@platejs/link';
import { useQuery } from '@tanstack/react-query';
import type { TLinkElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { userProfileOptions, userReferenceOptions } from '@hikka/api';
import { isUserReference, userUrlTarget } from '@hikka/core';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mentionTarget = (element: TLinkElement) => {
    const label = element.children
        .map((child) => ('text' in child ? child.text : ''))
        .join('');

    if (label[0] !== '@') return null;

    return userUrlTarget(element.url ?? '');
};

function MentionAvatar({ target }: { target: string }) {
    const isReference = isUserReference(target);

    const { data: referenced } = useQuery({
        ...userReferenceOptions({ path: { reference: target } }),
        enabled: isReference,
    });

    const { data: profile } = useQuery({
        ...userProfileOptions({ path: { username: target } }),
        enabled: !isReference,
    });

    const user = referenced ?? profile;

    return (
        <Avatar className="mr-1 size-5 self-center" contentEditable={false}>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
        </Avatar>
    );
}

export function LinkElement(props: PlateElementProps<TLinkElement>) {
    const target = mentionTarget(props.element);

    return (
        <PlateElement
            {...props}
            as="span"
            className={
                target
                    ? 'inline-flex items-baseline text-primary-foreground hover:underline'
                    : 'text-primary-foreground decoration-primary-foreground underline-offset-2 hover:underline'
            }
            attributes={{
                ...props.attributes,
                ...getLinkAttributes(props.editor, props.element),
                onMouseOver: (e) => {
                    e.stopPropagation();
                },
            }}
        >
            {target && <MentionAvatar target={target} />}
            {props.children}
        </PlateElement>
    );
}
