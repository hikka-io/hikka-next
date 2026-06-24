export default function remarkDisableTokenizer() {
    // @ts-expect-error: `this` is the unified Processor at runtime.
    const data = this.data();

    const micromarkExtensions =
        data.micromarkExtensions || (data.micromarkExtensions = []);

    micromarkExtensions.push({
        disable: {
            null: ['codeIndented', 'codeFenced', 'codeText'],
        },
    });
}
