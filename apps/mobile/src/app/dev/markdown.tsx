import { Redirect } from 'expo-router';
import { ScrollView } from 'react-native';

import { MDViewer } from '@/components/markdown';

const FIXTURE = `Звичайний абзац із **жирним**, *курсивом*, ~~закресленим~~ та [посиланням на аніме](https://hikka.io/anime/re-zero-kara-hajimeru-isekai-seikatsu-4th-season-a8f8d0). Тут один рядок
перенесений м'яко, а далі жорсткий розрив  
після двох пробілів.

[Персонаж](https://hikka.io/characters/emilia-1d4e5f), [автор](https://hikka.io/people/person-1a2b3c), [користувач](https://hikka.io/u/olexh), [MyAnimeList](https://myanimelist.net/anime/66192), [невідомий сайт](https://example.com/page), [toloka](https://toloka.to/t1).

Згадка у тексті: дякую @olexh за пораду, і за посиланням [@typicaladm](https://hikka.io/u/typicaladm).

Рядок зі спойлером: головний герой :spoiler[помирає в кінці **першого** сезону] але повертається. Re:Zero і ::note[лист] лишаються текстом, \`код\` теж.

:::spoiler
Це блоковий спойлер із **жирним** текстом.

Другий абзац усередині спойлера та [посилання](https://hikka.io/anime/naruto).
:::

# Заголовок виглядає як абзац

- Перший пункт списку
- Другий пункт із *курсивом*
    - Вкладений пункт
- Третій пункт

1. Перший крок
2. Другий крок
3. Третій крок

> Цитата з кількома рядками
>
> та другим абзацом цитати.

---

![Постер](https://cdn.hikka.io/avatar.jpg)

Кінець фрагмента.`;

export default function MarkdownFixtureScreen() {
    if (!__DEV__) return <Redirect href="/" />;

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="p-4"
        >
            <MDViewer selectable>{FIXTURE}</MDViewer>
        </ScrollView>
    );
}
