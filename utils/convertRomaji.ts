const ALPHABET: Record<string, string> = {
    a: 'а',
    i: 'і',
    u: 'у',
    e: 'е',
    o: 'о',
    ka: 'ка',
    ki: 'кі',
    ku: 'ку',
    ke: 'ке',
    ko: 'ко',
    ga: 'ґа',
    gi: 'ґі',
    gu: 'ґу',
    ge: 'ґе',
    go: 'ґо',
    sa: 'са',
    shi: 'ші',
    su: 'су',
    se: 'се',
    so: 'со',
    za: 'дза',
    ji: 'джі',
    zu: 'дзу',
    ze: 'дзе',
    zo: 'дзо',
    ta: 'та',
    chi: 'чі',
    tsu: 'цу',
    te: 'те',
    to: 'то',
    da: 'да',
    de: 'де',
    do: 'до',
    na: 'на',
    ni: 'ні',
    nu: 'ну',
    ne: 'не',
    no: 'но',
    ha: 'ха',
    hi: 'хі',
    fu: 'фу',
    he: 'хе',
    ho: 'хо',
    ba: 'ба',
    bi: 'бі',
    bu: 'бу',
    be: 'бе',
    bo: 'бо',
    pa: 'па',
    pi: 'пі',
    pu: 'пу',
    pe: 'пе',
    po: 'по',
    ma: 'ма',
    mi: 'мі',
    mu: 'му',
    me: 'ме',
    mo: 'мо',
    ya: 'я',
    yu: 'ю',
    yo: 'йо',
    ra: 'ра',
    ri: 'рі',
    ru: 'ру',
    re: 'ре',
    ro: 'ро',
    wa: 'ва',
    wo: 'о',
    n: 'н',
    kya: 'кя',
    kyu: 'кю',
    kyo: 'кьо',
    gya: 'ґя',
    gyu: 'ґю',
    gyo: 'ґьо',
    sha: 'ся',
    shu: 'сю',
    sho: 'сьо',
    ja: 'дзя',
    ju: 'дзю',
    jo: 'дзьо',
    cha: 'чя',
    chu: 'чю',
    cho: 'чьо',
    nya: 'ня',
    nyu: 'ню',
    nyo: 'ньо',
    hya: 'хя',
    hyu: 'хю',
    hyo: 'хьо',
    bya: 'бя',
    byu: 'бю',
    byo: 'бьо',
    pya: 'пя',
    pyu: 'пю',
    pyo: 'пьо',
    mya: 'мя',
    myu: 'мю',
    myo: 'мьо',
    rya: 'ря',
    ryu: 'рю',
    ryo: 'рьо',
};

export function romajiToKovalenko(romaji: string): string {
    const lowerRomaji = romaji.toLowerCase();
    let translated: string = '';
    let i: number = 0;

    while (i < lowerRomaji.length) {
        if (lowerRomaji[i] === ' ') {
            translated += ' ';
            i++;
        } else {
            let checkLen: number = Math.min(3, lowerRomaji.length - i);

            while (checkLen > 0) {
                const checkStr: string = lowerRomaji.slice(i, i + checkLen);

                if (ALPHABET[checkStr]) {
                    if (
                        ['a', 'u', 'i', 'o', 'e'].includes(
                            lowerRomaji.slice(i - 1, i),
                        ) &&
                        checkStr === 'i'
                    ) {
                        if (lowerRomaji.slice(i + 1, i + 2) === ' ') {
                            translated += 'й';
                        } else {
                            translated += 'ї';
                        }
                    } else if (
                        checkStr === 'e' &&
                        lowerRomaji.slice(i - 1, i) === 'i'
                    ) {
                        translated += 'є';
                    } else if (
                        checkStr === 'n' &&
                        ['m', 'b', 'p'].includes(
                            lowerRomaji.slice(i + 1, i + 2),
                        )
                    ) {
                        translated += 'м';
                    } else {
                        translated += ALPHABET[checkStr];
                    }

                    i += checkLen;

                    if (i < lowerRomaji.length) {
                        if (
                            lowerRomaji[i] === 'o' &&
                            lowerRomaji.slice(i - 1, i) === 'o'
                        ) {
                            translated += ALPHABET['u'];
                            i++;
                        } else if (
                            lowerRomaji[i] === 'e' &&
                            lowerRomaji.slice(i - 1, i) === 'e'
                        ) {
                            translated += ALPHABET['i'];
                            i++;
                        }
                    }

                    break;
                }

                checkLen--;
            }

            if (checkLen === 0) {
                translated += romaji[i];
                i++;
            }
        }
    }

    return translated;
}
