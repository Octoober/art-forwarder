// Enabling and disabling tags.
export const TAGS = true;

export const CAPTION = {
    sourcePrefix: 'source',
    sourceSeparator: ' ⋮ ',
}

// Limit media items
export const MAX_ITEMS = 10;

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
