// Enabling and disabling tags.
export const TAGS = true;

export const CAPTION = {
    sourcePrefix: 'source',
    sourceSeparator: ' | ',
}

// Limit media items
export const MAX_ITEMS = 10;

// An object containing CSS selectors.
export const SELECTORS = {
    image: [
        'img#image', // rule34.xxx
        'img.fit-width' // danbooru.donmai.us
    ],
    tags: [
        {
            title: 'character',
            selectors: [
                'li.tag-type-character.tag', // rule34.xxx
                'li.tag-type-4' // danbooru.donmai.us
            ]
        },
        {
            title: 'copyright',
            selectors: [
                'li.tag-type-copyright.tag', // rule34.xxx
                'li.tag-type-3' // danbooru.donmai.us
            ]
        }
    ]
};

export const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

/**
 * Enum representing error levels.
 *
 * @readonly
 * @enum {string}
 */
export const ERROR_LEVELS = Object.freeze({
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
});

/**
 * Enum representing type of the media.
 *
 * @readonly
 * @enum {string}
 */
export const MEDIA_TYPES = Object.freeze({
    PHOTO: 'photo',
    VIDEO: 'video',
    DOCUMENT: 'document',
    ANIMATION: 'animation',
});
