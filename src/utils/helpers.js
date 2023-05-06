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
