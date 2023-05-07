export const TELEGRAM_API_URL = 'https://api.telegram.org/bot/'

export const SELECTORS = {
    image: ['img#image', 'img.fit-width'],
    tags: {
        character: [
            'li.tag-type-4',
            'li.tag-type-character.tag'
        ],
        copyright: [
            'li.tag-type-copyright.tag',
            'li.tag-type-3'
        ]
    }
};
