
// Enabling and disabling tags.
export const TAGS = true;

// An object containing CSS selectors.
export const SELECTORS = {
    image: [
        'img#image', // rule34.xxx
        'img.fit-width' // danbooru.donmai.us
    ],
    tags: {
        copyright: [
            'li.tag-type-copyright.tag', // rule34.xxx
            'li.tag-type-3' // danbooru.donmai.us
        ],
        character: [
            'li.tag-type-character.tag', // rule34.xxx
            'li.tag-type-4' // danbooru.donmai.us
        ],
        // meta: [
        //     'ul.meta-tag-list > li.tag-type-5' // danbooru.donmai.us
        // ]
    }
};

export const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

export const ERROR_LEVELS = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
};
