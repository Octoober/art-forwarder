export const selectors = {
    media: [
        'img.fit-width',
        'video#image.fit-width',
    ],

    tags: [
        {
            title: 'character',
            selectors: 'li.tag-type-4',
        },
        {
            title: 'copyright',
            selectors: 'li.tag-type-3',
        },
    ],

    source: 'li#post-info-source > a[rel="external noreferrer nofollow"]'
}
