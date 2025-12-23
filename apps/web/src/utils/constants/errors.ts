export const ERRORS: Record<string, Record<string, string>> = {
    auth: {
        activation_valid:
            'Попередній токен активації поштової скиньки все ще дійсний.',
        reset_valid: 'Попередній токен зміни паролю все ще активний.',
        email_exists: 'Користувач з даною поштою вже зареєстрований.',
        activation_expired:
            'Термін дії токену активації поштової скриньки минув.',
        activation_invalid: 'Токен активації поштової скиньки недійсний.',
        oauth_code_required: 'Потрібен OAuth код.',
        invalid_provider: 'Невірний OAuth провайдер.',
        username_taken: 'Імʼя користувача вже зайнято.',
        reset_expired: 'Термін дії токену зміни паролю минув.',
        reset_invalid: 'Токен зміни паролю недійсний.',
        already_activated: 'Вже активовано.',
        invalid_token: 'Токен авторизації недійсний',
        missing_token: 'Токен авторизації відсутній.',
        invalid_password: 'Невірний пароль.',
        username_set: 'Імʼя користувача вже встановлено.',
        token_expired: 'Термін токену авторизації минув.',
        invalid_code: 'OAuth код недійсний.',
        oauth_error: 'Виникла помилка під час OAuth авторизації.',
        user_not_found: 'Користувача не знайдено.',
        email_set: 'Email вже використовується',
        not_available: 'Реєстрація недоступна',
    },
    settings: {
        username_cooldown:
            'Імʼя користувача можна змінювати один раз в годину.',
        email_cooldown: 'Поштову скриньку можна змінювати один раз на день.',
        username_taken: 'Імʼя користувача вже зайнято.',
    },
    permission: {
        denied: 'Ви не маєте дозволу для виконання цієї дії.',
    },
    anime: {
        no_franchise: "Це аніме не має пов'язаного",
        unknown_producer: 'Невідомий продюсер',
        unknown_studio: 'Невідома студія',
        bad_year: 'Неправильний рік',
        unknown_genre: 'Невідомий жанр',
        not_found: 'Аніме не знайдено',
    },
    edit: {
        not_pending:
            'Можна змінювати лише ті правки, які очікують на перевірку',
        not_author: 'Тільки автор може змінювати правку',
        invalid_content_id: 'Неправильний ідентифікатор контенту',
        content_not_found: 'Контент не знайдено',
        bad_edit: 'Ця правка є недійсною',
        invalid_field: 'Неправильне поле',
        not_found: 'Правку не знайдено',
    },
    studio: {
        not_found: 'Студію не знайдено',
    },
    genre: {
        not_found: 'Жанр не знайдено',
    },
    watch: {
        bad_episodes: 'Неправильний номер епізодів',
        not_found: 'Запис перегляду не знайдено',
    },
    favourite: {
        exists: 'Улюблений запис для цього аніме вже існує',
        not_found: 'Улюблений запис не знайдено',
    },
    captcha: {
        invalid: 'Не вдалося підтвердити капчу',
    },
    user: {
        not_found: 'Користувача не знайдено.',
    },
    follow: {
        already_following: 'Ви вже підписані на цього користувача',
        not_following: 'Ви не підписані на цього користувача',
        invalid_action: 'Недійсна дія',
        self: 'Не можна підписатися на себе',
    },
    search: {
        query_down: 'Пошук тимчасово недоступний',
    },
    company: {
        not_found: 'Компанію не знайдено',
    },
    character: {
        not_found: 'Персонажа не знайдено',
    },
    person: {
        not_found: 'Людину не знайдено',
    },
};

