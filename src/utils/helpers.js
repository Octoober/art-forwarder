import { MEDIA_TYPES } from "../constants";

/**
* Converts a given string to a hashtag.
*
* @param {string} text - The input string.

* @returns {string} - The hashtag string.
*/
export function toHashtag(text) {
    return '#' + text.replace(/[\(].*?[\)]/g, '')
        .replace(/[^\w\s]|_/g, '')
        .trim().replace(/\s+/g, '_').toLowerCase();
}

/**
 * Get hashtags from selectors.
 *
 * @param {Object[]} selectorGroup - Array CSS selectors.
 *
 * @returns {Object[]} - The object of hashtags group.
 */
export function getHashtags(selectorGroup) {
    let hashtagGroup = []

    for (const { selectors, title } of selectorGroup) {
        const elements = document.querySelectorAll(selectors);

        if (!elements.length) continue;

        const tags = Array.from(elements, element => {
            const hashtagElement = element.querySelector('a:nth-child(2)');
            if (!hashtagElement) return [];

            return toHashtag(hashtagElement.textContent);
        });

        hashtagGroup.push({
            title: title.length ? title : '',
            tags: tags ? tags : []
        });
    };

    return hashtagGroup;
}

/**
 * Get media url by selector.
 *
 * @param {string[]} selectors - An array of selectors.
 *
 * @returns {string|null} - The srcof the media element or null if not found.
 */
export function getMediaUrlBySelector(selectors) {
    const mediaElement = document.querySelector(selectors.join(','));
    const src = mediaElement?.src || (mediaElement?.src === '' ? mediaElement?.querySelector('[src]').src : null);
    const tagElement = mediaElement.tagName;

    const mediaTypeMap = {
        IMG: { type: MEDIA_TYPES.PHOTO, src },
        VIDEO: { type: MEDIA_TYPES.VIDEO, src }
    };

    return mediaTypeMap[tagElement] ?? null;
}

export async function getMediaSizeByUrl(mediaUrl) {
    try {
        const response = await fetch(mediaUrl);
        if (!response.ok) {
            throw new Error('Load error');
        }
        const size = response.headers.get('content-length');
        return size;
    } catch (error) {
        throw new Error(`Failed to fetch media data: ${error.message}`);
    }
}

/**
 * Adjusts the position of "parentElement" relative to "targetElement".
 *
 * @param {Element} parentElement - The element that needs to be repositioned.
 * @param {Element} targetElement - The element relative to which the "parentElement" is positioned.
 *
 * @returns {void}
 */
export function positionRelativeToTarget(parentElement, targetElement) {
    if (!parentElement || !targetElement) return;

    const targetRect = targetElement.getBoundingClientRect();

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    parentElement.style.left = targetRect.right - 80 + scrollX + 'px';
    parentElement.style.top = targetRect.top + 10 + scrollY + 'px';

    parentElement.style.display = 'block';
}

/**
 * Convert a tag group to markdown format.
 *
 * @param {Object[]} tagGroup - An array of object with title and tags properties.
 *
 * @returns {string} The converted markdown.
 */
export function convertTagsToHtml(tagGroup) {
    let text = '';

    for (const { title, tags } of tagGroup) {
        text += title.length | tags.length ? `<i>${title}:</i> ${tags.join(' ')}\n` : '';
    }

    return text;
}

/**
 * Extract the hashtags from a mediaGroup.
 *
 * @param {Array} mediaGroup - The mediaGroup object.
 *
 * @returns {Array<Object>} An array of object containing the totle and tags.
 */
export function exstractHashtags(mediaGroup) {
    const hashtags = {};

    mediaGroup.forEach(item => {
        if (!item.hashtags) return hashtags;

        item.hashtags.forEach(({ title, tags }) => {
            if (!hashtags[title]) hashtags[title] = new Set();

            tags.map(tag => hashtags[title].add(tag));
        });
    });

    return Object.entries(hashtags).map(([title, tags]) => ({
        title,
        tags: [...tags]
    }));
}

export function convertLinksToHtml(mediaGroup, prefix, separator) {
    const newLinks = mediaGroup
        .map((item, index) => {
            const linkNumer = mediaGroup.length > 1 ? ' ' + (index + 1) : '';
            return item.sourceUrl.length !== 0 ? `<a href="${item.sourceUrl}">${prefix}${linkNumer}</a>` : null;
        })
        .filter(item => item)

    return newLinks.join(separator);
}

export function getExtensionByUrl(url) {
    const extensionRegex = /\.(\w+)(?:$|\?)/;
    const matches = url.match(extensionRegex);

    return matches ? matches[1] : '';
}

export function repairPixivSourceUrl(url) {
    const regex = /\/(\d+)(?:_p\d+)?.png$/;
    const match = url.match(regex);
    const sourceId = match[1];
    return `https://www.pixiv.net/en/artworks/${sourceId}`;
}
