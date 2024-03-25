import { marked } from 'marked';

const htmlEscapeToText = (text: string) => {
    return text.replace(/\&\#[0-9]*;|&amp;/g, (escapeCode: string) => {
        if (escapeCode.match(/amp/)) {
            return '&';
        }

        return '';
    });
};

const renderPlain = () => {
    let render = new marked.Renderer({ breaks: true });

    // render just the text of a link
    render.link = function (href, title, text) {
        return text;
    };

    // render just the text of a paragraph
    render.paragraph = function (text) {
        return htmlEscapeToText(text) + '\r\n';
    };

    // render just the text of a heading element, but indecate level
    render.heading = function (text, level) {
        return level + ' ) ' + text;
    };

    // render nothing for images
    render.image = function (href, title, text) {
        return '';
    };

    render.em = function (text) {
        return text;
    };

    render.strong = function (text) {
        return text;
    };

    return render;
};

export default function parseTextFromMarkDown(mdString: string) {
    if (!mdString) return mdString;

    const parsed = marked(mdString, {
        renderer: renderPlain(),
        async: false,
        breaks: true,
    })

    return (parsed as string).replaceAll('&#x20;', " ");
}
