import { ERROR_LEVELS, MAX_ITEMS } from "../constants";
import { Notification } from "../models/Notification";


/**
 * Represent a group of media items.
 */
export class MediaGroup {
    /**
     * Adds a new media item to the media group.
     *
     * @async
     * @param {MediaItem} mediaItem - An object containing information about the new post.
     * @returns {Promise<Notification>} A notification indicating the result of the operation.
     */
    async addMedia(mediaItem) {
        const group = await this.getMediaGroup();

        // Check if an element exists in a group.
        if (group.find(item => item.url === mediaItem.url)) {
            return new Notification(ERROR_LEVELS.WARNING, 'A media already exists in the group.');
        }

        // Check if the maximum number of items has been reached.
        if (group.length >= MAX_ITEMS) {
            return new Notification(ERROR_LEVELS.WARNING, `You have reached the maximum limit of ${MAX_ITEMS} media files.`);
        }

        try {
            // Save the updated media group.
            const updatedGroup = [...group, mediaItem];
            await this.saveMedia(updatedGroup);

            return new Notification(ERROR_LEVELS.SUCCESS, 'Successfully added media from the group.');
        } catch (error) {
            console.error(error);
            return new Notification(ERROR_LEVELS.ERROR, `Unable to add media to group. Please try again later: ${error}`);
        }
    }

    /**
     * Remove a media item from the media group.
     *
     * @async
     * @param {string} url - The url of the media to remove.
     * @returns {Promise<Notification>}  A notification indicating the result of the operation.
     */
    async removeMedia(url) {
        try {
            const group = await this.getMediaGroup();
            const updatedGroup = group.filter((media) => media.url !== url);

            await this.saveMedia(updatedGroup);

            return new Notification(ERROR_LEVELS.SUCCESS, 'Successfully removed media from the group.');
        } catch (error) {
            console.error(error);
            return new Notification(ERROR_LEVELS.ERROR, error);
        }
    }

    /**
     * Retrieves the media group from the local storage.
     *
     * @async
     * @returns {Promise<MediaItem[]>} An object containing the media group.
     */
    async getMediaGroup() {
        const data = await chrome.storage.local.get('mediaGroup');
        return data?.mediaGroup || [];
    }

    /**
     * Save an array of media group to the Chrome storage.
     *
     * @async
     * @param {MediaItem[]} mediaGroup - An array of media group objects to be saved.
     * @returns {Promise<void>} The promise that resolves when the media group is successfully saved.
     */
    async saveMedia(mediaGroup) {
        await chrome.storage.local.set({ mediaGroup });
    }
}
