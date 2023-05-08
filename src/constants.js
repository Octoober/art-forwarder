export const TAGS = true;

export const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

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
        ]
    }
};
