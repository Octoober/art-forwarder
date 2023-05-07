import { TELEGRAM_API_URL } from '../constants'
/**
 * A collection of image URLs and associated tags.
 *
 * @typedef {Object} postCollection
 * @property {string} imageUrl - The URL of the image.
 * @property {string} tag - An associated tag for the image.
 */

/** A class for sending of images to a Telegram channel or chat. */
export class TelegramImageSender {
    /**
     * Send an array images to the Telegram channel/chat.
     *
     * @param {postCollection} collection
     * @returns {Promise<string>}
     * @throws {Error} If request error.
     */
    async sendImage(postCollection) {
        const { botToken, chatId } = await new Promise(resolve => {
            chrome.storage.sync.get(['botToken', 'chatId'], resolve);
        });

        const mediaData = postCollection.map((post, index) => ({
            type: post.type,
            media: post.media,
            caption: index === 0 ? post.caption : ''
        }));

        const requestBody = JSON.stringify({
            chat_id: chatId,
            media: mediaData
        });

        try {
            const response = await fetch(TELEGRAM_API_URL + botToken + '/sendMediaGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });

            if (response.ok) {
                await chrome.storage.local.clear();
                console.log('Storage cleared.')
            }
        } catch (error) {
            throw new Error(`Request error: ${error}`);
        }
    }
}
