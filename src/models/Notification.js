import { ERROR_LEVELS } from "../constants";

/**
 * Class representing a notification.
 */
export class Notification {
    /**
     *
     * @param {ERROR_LEVELS} level - The level of the notification. It can be an ERROR_LEVELS object.
     * @param {string} message - The message of the notification.
     */
    constructor(level, message) {
        if (!Object.values(ERROR_LEVELS).includes(level)) {
            throw new Error(`Invalid level error: ${level}`);
        }

        this.level = level;
        this.message = message.toString();
    }
}
