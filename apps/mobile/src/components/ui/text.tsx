import {
    Children,
    createContext,
    type FC,
    type ReactNode,
    type Ref,
    useContext,
} from 'react';

import { Text as NativeText, type TextProps } from 'react-native';

import { cn } from '@/utils/cn';

const TextClassContext = createContext<string | undefined>(undefined);

type Props = TextProps & {
    ref?: Ref<NativeText>;
};

const Text: FC<Props> = ({ className, ...props }) => {
    const inherited = useContext(TextClassContext);

    return (
        <NativeText
            className={cn('text-base text-foreground', inherited, className)}
            {...props}
        />
    );
};

function wrapText(children: ReactNode, props?: TextProps) {
    return Children.map(children, (child) =>
        typeof child === 'string' || typeof child === 'number' ? (
            <Text {...props}>{child}</Text>
        ) : (
            child
        ),
    );
}

export { Text, TextClassContext, wrapText };
