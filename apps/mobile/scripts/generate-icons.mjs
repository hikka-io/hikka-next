// Renders apps/web/public/logo-icon.svg into the app icon, Android adaptive icon layers and splash icon, and syncs the matching colors into app.json. Colors come from src/theme.css.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const LOGO = fileURLToPath(
    new URL('../../web/public/logo-icon.svg', import.meta.url),
);
const THEME = fileURLToPath(new URL('../src/theme.css', import.meta.url));
const APP_JSON = fileURLToPath(new URL('../app.json', import.meta.url));
const OUT = fileURLToPath(new URL('../assets/images/', import.meta.url));
const SIZE = 1024;

function readToken(variant, name) {
    const css = readFileSync(THEME, 'utf8');
    const block = css.match(
        new RegExp(`@variant ${variant} \\{([\\s\\S]*?)\\n\\s{8}\\}`),
    );
    const value = block?.[1].match(new RegExp(`--color-${name}: (#\\w+);`));
    if (!value) throw new Error(`Token ${name} not found for ${variant}`);
    return value[1];
}

const brand = readToken('light', 'brand');
const glyph = readFileSync(LOGO, 'utf8').match(/<path[\s\S]*?\/>/)[0];
const [, , logoWidth] = readFileSync(LOGO, 'utf8')
    .match(/viewBox="([^"]+)"/)[1]
    .split(' ')
    .map(Number);

function render(name, { background, color, scale }) {
    const glyphSize = SIZE * scale;
    const offset = (SIZE - glyphSize) / 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
${background ? `<rect width="${SIZE}" height="${SIZE}" fill="${background}"/>` : ''}
<g transform="translate(${offset} ${offset}) scale(${glyphSize / logoWidth})">${glyph.replace(/fill="[^"]*"/, `fill="${color}"`)}</g>
</svg>`;
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: SIZE } })
        .render()
        .asPng();
    writeFileSync(`${OUT}${name}`, png);
    console.log(`${name} (${png.length} bytes)`);
}

function renderSolid(name, color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="${color}"/></svg>`;
    writeFileSync(
        `${OUT}${name}`,
        new Resvg(svg, { fitTo: { mode: 'width', value: SIZE } })
            .render()
            .asPng(),
    );
    console.log(name);
}

mkdirSync(OUT, { recursive: true });
render('icon.png', { background: brand, color: '#ffffff', scale: 0.56 });
render('android-icon-foreground.png', { color: '#ffffff', scale: 0.44 });
renderSolid('android-icon-background.png', brand);
render('android-icon-monochrome.png', { color: '#000000', scale: 0.44 });
render('splash-icon.png', { color: brand, scale: 0.6 });
const config = JSON.parse(readFileSync(APP_JSON, 'utf8'));
config.expo.android.adaptiveIcon.backgroundColor = brand;
const splash = config.expo.plugins.find(
    (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen',
)[1];
splash.backgroundColor = readToken('light', 'background');
splash.dark = {
    ...splash.dark,
    backgroundColor: readToken('dark', 'background'),
};
writeFileSync(APP_JSON, `${JSON.stringify(config, null, 4)}\n`);
console.log('app.json colors synced');
