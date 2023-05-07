/**
* Функция принимает текстовую строку и возвращает хэш-тег, подходящий для публикации в телеграм.
* Пример: This is a test (string) => #this_is_a_test_string
*
* @param {string} text - Строка для преобразования.
* @return {string} - Готовый хэш-тег
*/
export function toHashtag(text) {
    return '#' + text.replace(/[\(].*?[\)]/g, '')
        .replace(/[^\w\s]|_/g, '')
        .trim().replace(/\s+/g, '_').toLowerCase();
}

/**
 * Парсит теги и преобраует их подходящие для телеграма хэштеги.
 * Подходит для: rule34.xxx и danbooru.donmai.us
 *
 * @param {string[]} selectors - Массив CSS-селектров, которые необходимо найти на странице.
 * @returns {string[]} - Массив хэштегов.
 */
export function getHashtagsArray(selectors) {
    const hashtags = [];

    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        Array.from(elements).forEach(element => {
            const hashtagElement = element.querySelector('a:nth-child(2)'); // Только вторую ссылку
            if (!hashtagElement) return;

            // Преобразует теги в формат, который поддерживает телеграм, добавляет префик "#"
            const hashtagText = toHashtag(hashtagElement.innerText);
            if (hashtagText) {
                hashtags.push(hashtagText);
            }
        });
    })

    return hashtags;
}

/**
 * Ищет изображение на стринице по заданным CSS-селектрам и получает его URL.
 *
 * @param {string[]} selectors - Массив с CSS-селектрами.
 * @returns {?string} - URL изображения или null, если изображение не найдено.
 */
export function getImageUrlBySelector(selectors) {
    const imageElement = document.querySelector(selectors.join(','));
    return imageElement ? imageElement.src : null;
}

/**
 * Группирует отдельные посты в локальном хранилище для дальнейшей публикации их единой группой.
 *
 * @param {string} pageUrl - Ссылка на страницу.
 * @param {string} type - Тип медиа контента (photo, video).
 * @param {string} media - Строка c URL на медиа, которые следует опубликовать.
 * @param {string} caption - Описание, которое будет отображаться у опубликованных постов.
 */
export async function saveToCollection(pageUrl, type, media, caption) {
    try {
        const { postCollection } = await chrome.storage.local.get('postCollection') || {};

        // Выполняется если postCollection существует, а так же имеет в себе такой же pageUrl
        if (postCollection && postCollection.some(post => post.pageUrl === pageUrl)) {
            throw new Error('This pageUrl already in the collection');
        }

        // Если postCollection существует - перезаписываем его в новую переменную,
        // в противном случае записываем пустую переменную
        const newPostCollection = postCollection ? [...postCollection] : [];

        // Добавляет новые значения в коллекцию
        newPostCollection.push({ pageUrl, type, media, caption });

        // Обнавляет коллекцию в хранилище
        await chrome.storage.local.set({ postCollection: newPostCollection }, () => {
            console.log('Successfully added to the collection');
        });
    } catch (error) {
        console.error(error)
        throw new Error('Unable to save photo to collection! Please try again later.');
    }
}
