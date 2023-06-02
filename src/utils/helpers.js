
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
        const elements = document.querySelectorAll(selectors.join(','));

        if (!elements.length) continue;

        const tags = Array.from(elements, element => {
            const hashtagElement = element.querySelector('a:nth-child(2)');
            if (!hashtagElement) return;

            return toHashtag(hashtagElement.textContent);
        });

        hashtagGroup.push({
            title,
            tags
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
    const element = document.querySelector(selectors.join(','));
    return element ? element.src : null;
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
export function convertTagsToMarkdown(tagGroup) {
    let text = '';

    for (const {title, tags} of tagGroup) {
        text += `<i>${title}:</i> ${tags.join(' ')}\n`;
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
        item.hashtags.forEach(hashtagGroup => {
            const { title, tags } = hashtagGroup;
            if (!hashtags[title]) hashtags[title] = new Set();

            tags.map(tag => hashtags[title].add(tag));
        });
    });

    return Object.entries(hashtags).map(([title, tags]) => ({
        title,
        tags: [...tags]
    }));
}
