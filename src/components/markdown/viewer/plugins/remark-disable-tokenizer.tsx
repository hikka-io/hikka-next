export default function remarkDisableTokenizer() {
    // @ts-expect-error: TS is wrong about `this`.
    const self = /** @type {Processor} */ this;
    const data = self.data();

    const micromarkExtensions =
        data.micromarkExtensions || (data.micromarkExtensions = []);

    micromarkExtensions.push({
        disable: {
            null: ['codeIndented', 'codeFenced', 'codeText', 'list'],
        },
    });
}
