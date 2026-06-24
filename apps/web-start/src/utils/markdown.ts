import { marked } from 'marked';

const htmlEscapeToText = (text: string) => {
    return text.replace(/&#[0-9]*;|&amp;/g, (escapeCode: string) => {
        if (escapeCode.match(/amp/)) {
            return '&';
        }

        return '';
    });
};

const renderPlain = () => {
    const render = new marked.Renderer({ breaks: true });

    // render just the text of a link
    render.link = (_href, _title, text) => text;

    // render just the text of a paragraph
    render.paragraph = (text) => `${htmlEscapeToText(text)}\r\n`;

    // render just the text of a heading element, but indecate level
    render.heading = (text, level) => `${level} ) ${text}`;

    // render nothing for images
    render.image = (_href, _title, _text) => '';

    render.em = (text) => text;

    render.strong = (text) => text;

    render.blockquote = (text) => text;

    return render;
};

export function parseTextFromMarkDown(mdString: string) {
    if (!mdString) return mdString;

    const parsed = marked(mdString, {
        renderer: renderPlain(),
        async: false,
        breaks: true,
    });

    return (parsed as string).replaceAll('&#x20;', ' ');
}
