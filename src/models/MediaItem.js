import { MEDIA_TYPES } from "../constants";


/**
 * Class representing a media item.
 */
export class MediaItem {
    /**
     * Create a new media item.
     *
     * @param {MEDIA_TYPES} type - The type of the media.
     * @param {string} mediaUrl - The URL of the media.
     * @param {string} caption - The cation for the media item.
     * @param {Object} hashtags - The object that contains hashtags.
     * @param {string} sourceUrl
     */
    constructor(
        element,
        type,
        url,
        pageUrl,
        extension,
        tagName,
        sourceUrl,
        hashtags,
        caption) {
        console.log('type in:', type);
        if (!Object.values(MEDIA_TYPES).includes(type)) {
            throw new Error(`Invalid media type: ${type}`);
        }

        this.element = element;
        this.type = type;
        this.url = url;
        this.pageUrl = pageUrl;
        this.extension = extension;
        this.tagName = tagName;
        this.sourceUrl = sourceUrl;
        this.hashtags = hashtags;
        this.caption = caption || '';
        this.size = '';
    }
}
