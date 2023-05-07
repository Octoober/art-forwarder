/**
 * A collection of image URLs and associated tags.
 *
 * @typedef {Object} postCollection
 * @property {string} imageUrl - The URL of the image.
 * @property {string} tag - An associated tag for the image.
 */

/**
 * Класс для отправки изображений в телеграм канал или чат
 *
 * @class
 */
export class TelegramImageSender {
    /**
     * Send an array images to the Telegram channel/chat.
     *
     * @param {postCollection} collection
     * @returns {Promise<string>}
     */
    async sendImage(postCollection) {
        const { botToken, chatId } = await new Promise(resolve => {
            chrome.storage.sync.get(['botToken', 'chatId'], resolve);
        });

        // const mediaObject = postCollection.map((imageUrl, index) => {
        //     console.log(imageUrl, index)
        // })
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.telegram.org/bot${botToken}/sendMediaGroup`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // console.log(postCollection)
        const mediaData = postCollection.map((post, index) => ({
            type: post.type,
            media: post.media,
            caption: index === 0 ? post.caption : ''
        }))

        const requestBody = JSON.stringify({
            chat_id: chatId,
            media: mediaData
        });

        console.log(requestBody)

        xhr.send(requestBody);

        xhr.onload = async (e) => {
            console.log(e.target.response);

            if (xhr.status === 200) {
                await chrome.storage.local.clear(() => {
                    console.log('Clear')
                });
            }
        }
    }
}
