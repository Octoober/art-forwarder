/**
 * TelegramImageSender это класс для отправки изображений в телеграм канал или чат
 *
 * @class
 */
export class TelegramImageSender {

    /**
     * Отправляет изображение в телеграм канал или чат.
     *
     * @param {string} photoUrl - Ссылка на изображегие
     * @param {string[]} hashtagsArray - Массив с хэш-тегами
     */
    async sendImage(photoUrl, hashtagsArray) {
        // TODO: Стоит разгрузить этот метод. Вероятно переписать класс.

        if (!/^https?:\/\/.+/.test(photoUrl)) {
            throw new Error('Invalid photo URL');
        }

        const { botToken, chatId } = await this.getBotTokenAndChatId();

        if (!botToken || !chatId) {
            throw new Error('Missing Telegram API key or chat ID')
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.telegram.org/bot${botToken}/sendPhoto`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const captionText = Object.values(hashtagsArray).flat().join(' ');
        const requestBody = JSON.stringify({
            chat_id: chatId,
            photo: photoUrl,
            caption: captionText
        });

        try {
            xhr.send(requestBody);
        } catch (error) {
            throw new Error('Failed to send image');
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log('Image share success');
            } else {
                throw new Error(`Image share failed with status ${xhr.status}`);
            }
        };

        xhr.onerror = () => {
            throw new Error('Network error with sending imgae');
        };

    }

    getBotTokenAndChatId() {
        return new Promise(resolve => {
            chrome.storage.sync.get(['botToken', 'chatId'], resolve);
        });
    }
}
