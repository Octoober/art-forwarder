import { TELEGRAM_API_URL, TAGS} from '../constants';
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
    /**
     * Send an array images to the Telegram channel/chat.
     *
     * @param {postCollection} collection
     * @returns {Promise<string>}
     * @throws {Error} If request error.
     */
    async sendImage(mediaGroup) {
        const { botToken, chatId } = await chrome.storage.sync.get(['botToken', 'chatId']);

        const uniqueTags = removeDuplicateTags(mediaGroup).join(' ');

        const mediaData = mediaGroup.map((item, index) => ({
            type: item.type,
            media: item.mediaUrl,
            caption: index === 0 ? uniqueTags : ''
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
                // await chrome.storage.local.clear();
                // console.log('Storage cleared.')
                return {success: true, message: 'Success a send the media group.'};
            } else {
                console.error(response);
                return {success: false, message: 'Error send a media group.'};
            }
        } catch (error) {
            throw new Error(`Request error: ${error}`);
        }
    }
}
