import { ERROR_LEVELS } from "../constants";

/**
 * @typedef {Object} MediaItem
 * @property {string} type - The type of media (e.g. "photo" or "video").
 * @property {string} mediaUrl - The URL of the media file.
 * @property {string} caption - The caption for the media.
 */

/** A class for managing a media group of posts. */
export class MediaGroup {
    /**
     * Add a new post to the group.
     *
     * @param {MediaItem} mediaItem - An object containing information about the new post.
     * @throws {Error}
     */
    async addMedia({ type, mediaUrl, caption }) {
        try {
            const group = await this.getMediaGroup();

            if (group.find(item => item.mediaUrl === mediaUrl)) {
                return { level: ERROR_LEVELS.WARNING, message: 'A media already exists in the group.' };
            }
            const updatedGroup = [...group, { type, mediaUrl, caption }];
            if (group.length <= 10)
                await this.saveMedia(updatedGroup);

            return { level: ERROR_LEVELS.SUCCESS, message: 'Successfully added media to the group.' };
        } catch (error) {
            console.error(error);
            return { level: ERROR_LEVELS.ERROR, message: 'Unable to add media to group. Please try again later.' };
        }
    }

    /**
     * Remove a post from the group by its mediaUrl.
     *
     * @param {string} mediaUrl - The mediaUrl of the media to remove.
     */
    async removeMedia(mediaUrl) {
        try {
            const group = await this.getMediaGroup();
            const updatedGroup = group.filter((media) => media.mediaUrl !== mediaUrl);

            await this.saveMedia(updatedGroup);

            return { level: ERROR_LEVELS.SUCCESS, message: 'Successfully removed media from the group.' };
        } catch (error) {
            console.error(error);
            return { level: ERROR_LEVELS.ERROR, message: 'Unable to remove media from group.' };
        }
    }

    /**
     * Get a current array of posts in the group.
     *
     * @returns {Promise<MediaItem[]>}
     */
    async getMediaGroup() {
        const data = await chrome.storage.local.get('mediaGroup');
        return data?.mediaGroup || [];
    }

    /**
     * Save an array of media group to the Chrome storage.
     *
     * @param {MediaItem[]} mediaGroup - An array of media group objects to be saved.
     * @throws {Error} If the media cannot be saved to the Chrome storage.
     */
    async saveMedia(mediaGroup) {
        await chrome.storage.local.set({ mediaGroup });
    }
}
