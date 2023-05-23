import { TELEGRAM_API_URL, TAGS } from '../constants';
import { removeDuplicateTags } from './helpers';
/**
 * A collection of image URLs and associated tags.
 *
 * @typedef {Object} postCollection
 * @property {string} imageUrl - The URL of the image.
 * @property {string} tag - An associated tag for the image.
 */

/** A class for sending of images to a Telegram channel or chat. */
export class TelegramImageSender {
    _createRequestBody(chatId, mediaGroup) {
        const uniqueTags = removeDuplicateTags(mediaGroup).join(' ');

        const mediaData = mediaGroup.map((item, index) => ({
            type: item.type,
            media: item.mediaUrl,
            caption: index === 0 ? uniqueTags : ''
        }));

        return JSON.stringify({
            chat_id: chatId,
            media: mediaData,
            parse_mode: 'Markdown',
            schedule_date: Date.now() + 86400000
        });
    }

    /**
     * Send an array images to the Telegram channel/chat.
     *
     * @param {postCollection} collection
     * @returns {Promise<string>}
     * @throws {Error} If request error.
     */
    async sendImage(mediaGroup) {
        const { botToken, chatId } = await chrome.storage.sync.get(['botToken', 'chatId']);

        const requestBody = this._createRequestBody(chatId, mediaGroup);

        return fetch(TELEGRAM_API_URL + botToken + '/sendMediaGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
            .then(response => {
                if (response.ok) {
                    return { success: true, message: 'Success a send the media group.' };
                } else {
                    return { success: false, message: 'Error send a media group.' };
                }
            })
            .catch(error => {
                return { success: false, message: `Request error: ${error}` };
            });
    }
}
