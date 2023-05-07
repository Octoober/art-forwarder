/**
 * @typedef {Object} MediaItem
 * @property {string} pageUrl - The URL of the page where the post is located.
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
    async addMedia({ pageUrl, type, mediaUrl, caption }) { }

    /**
     * Remove a post from the group by its pageUrl.
     *
     * @param {string} pageUrl
     */
    async removeMedia(pageUrl) { }

    /**
     * Get a current array of posts in the group.
     */
    async getMedia() { }

    /**
     * Save an array of posts to the Chrome storage.
     *
     * @param {Array} posts - An array of posts objects to be saved.
     * @throws {Error} If the posts cannot be saved to the Chrome storage.
     */
    async saveMedia(posts) { }
}
