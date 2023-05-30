import { ERROR_LEVELS } from "../constants";
import { Notification } from "../models/Notification";


/** A class for managing a media group of posts. */
export class MediaGroup {
    /**
     * Add a new post to the group.
     *
     * @param {type MediaItem} mediaItem - An object containing information about the new post.
     * @throws {Error}
     */
    async addMedia({ type, url, caption }) {
        try {
            const group = await this.getMediaGroup();

            if (group.find(item => item.url === url)) {
                return new Notification(ERROR_LEVELS.WARNING, 'A media already exists in the group.');
            }
            const updatedGroup = [...group, { type, url, caption }];
            if (group.length <= 10)
                await this.saveMedia(updatedGroup);

            return new Notification(ERROR_LEVELS.SUCCESS, 'Successfully added media from the group.');
        } catch (error) {
            console.error(error);
            return new Notification(ERROR_LEVELS.ERROR, `Unable to add media to group. Please try again later: ${error}`);
        }
    }

    /**
     * Remove a post from the group by its url.
     *
     * @param {string} url - The url of the media to remove.
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
