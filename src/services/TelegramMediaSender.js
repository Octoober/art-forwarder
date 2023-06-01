import { TELEGRAM_API_URL, ERROR_LEVELS } from '../constants';
import { Notification } from '../models/Notification';
import { removeDuplicateTags } from '../utils/helpers';


/**
 * A class for sending of media to the Telegram channel or chat.
 */
export class TelegramMediaSender {
    /**
     *  Create a request body for sending media to the Telegram.
     *
     * @param {string} chatId - The ID of the chat to send the media to.
     * @param {MediaItem[]} mediaGroup - An array MediaItems to be sent.
     *
     * @returns {string} - A JSON stringify of the request body.
     */
    _createRequestBody(chatId, mediaGroup) {
        const uniqueTags = removeDuplicateTags(mediaGroup).join(' ');

        const mediaData = mediaGroup.map((item, index) => ({
            type: item.type,
            media: item.url,
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
     * Send an array media to the Telegram channel or chat.
     *
     * @async
     * @param {MediaItem[]} mediaGroup - An array MediaItems to be sent.
     *
     * @returns {Promise<Notification>} - A promis that resolves with a Notification object.
     */
    async sendMedia(mediaGroup) {
        const { botToken, chatId } = await chrome.storage.sync.get(['botToken', 'chatId']);
        const requestBody = this._createRequestBody(chatId, mediaGroup);

        return fetch(TELEGRAM_API_URL + botToken + '/sendMediaGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then(response => {
            if (response.ok) {
                return new Notification(ERROR_LEVELS.SUCCESS, 'Media successfully sent to Telegram.');
            } else {
                console.error(response);
                return new Notification(ERROR_LEVELS.ERROR, 'Error sending the media to Telegram.');
            }
        }).catch(error => {
            console.error(error);
            return new Notification(ERROR_LEVELS.ERROR, error);
        });
    }
}
