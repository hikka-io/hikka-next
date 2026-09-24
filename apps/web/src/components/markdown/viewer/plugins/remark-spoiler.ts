import type { Parent, Root, RootContent, Text } from 'mdast';
import type {
    Directives,
    LeafDirective,
    TextDirective,
} from 'mdast-util-directive';

const DIRECTIVE_TYPES = new Set<string>([
    'containerDirective',
    'leafDirective',
    'textDirective',
]);

const isDirective = (node: RootContent): node is Directives =>
    DIRECTIVE_TYPES.has(node.type);

const isParent = (node: unknown): node is Parent =>
    Array.isArray((node as Parent).children);

const text = (value: string): Text => ({ type: 'text', value });

const withHName = (directive: Directives, hName: string) => {
    directive.data = { ...directive.data, hName };

    return [directive];
};

// Unknown or label-less inline directives are text the user typed, e.g. `Re:Zero`
const toLiteral = (directive: LeafDirective | TextDirective): RootContent[] => {
    const marker = `${directive.type === 'leafDirective' ? '::' : ':'}${directive.name}`;
    const children =
        directive.children.length > 0
            ? [text(`${marker}[`), ...directive.children, text(']')]
            : [text(marker)];

    return directive.type === 'leafDirective'
        ? [{ type: 'paragraph', children }]
        : children;
};

const tagDirectives = (node: Parent) => {
    node.children = node.children.flatMap((child): RootContent[] => {
        if (isParent(child)) tagDirectives(child);
        if (!isDirective(child)) return [child];

        // Directives with no hName carry no hast handler, and their text is dropped
        if (child.type === 'containerDirective')
            return withHName(
                child,
                child.name === 'spoiler' ? 'spoiler' : 'div',
            );

        return child.name === 'spoiler' && child.children.length > 0
            ? withHName(child, 'spoiler-inline')
            : toLiteral(child);
    });
};

export default function remarkSpoiler() {
    return (tree: Root) => {
        tagDirectives(tree);
    };
}
