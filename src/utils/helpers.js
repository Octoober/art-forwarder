
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
 * @param {string[]} selectors - Array CSS selectors.
 *
 * @returns {string[]} - The object of hashtags.
 */
export function getHashtags(selectors) {
    const hashtags = [];

    const tegs = Object.values(selectors).flat();

    tegs.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        Array.from(elements).forEach(element => {
            const hashtagElement = element.querySelector('a:nth-child(2)');
            if (!hashtagElement) return;

            const hashtagText = toHashtag(hashtagElement.innerText);
            if (hashtagText) {
                hashtags.push(hashtagText);
            }
        });
    });

    return hashtags;
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
 * Removes duplicate tags from a media group.
 *
 * @param {MediaItem[]} mediaGroup - An array of media items.
 *
 * @returns {string[]} An array of unique tags.
 */
export function removeDuplicateTags(mediaGroup) {
    const allTags = mediaGroup.flatMap(item => item.caption.split(' '));
    const uniqueTags = [...new Set(allTags)];

    return uniqueTags;
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
