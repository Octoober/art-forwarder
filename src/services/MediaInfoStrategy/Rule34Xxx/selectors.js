export const selectors = {
    media: [
        'img#image',
        'video#gelcomVideoPlayer',
    ],

    tags: [
        {
            title: 'character',
            selectors: 'li.tag-type-character.tag',
        },
        {
            title: 'copyright',
            selectors: 'li.tag-type-copyright.tag',
        },
    ],

    source: 'div#stats > ul > li'
}
