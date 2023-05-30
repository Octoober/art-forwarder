import { TelegramImageSender } from './utils/TelegramImageSender';
import { MediaGroup } from "./utils/MediaGroup";
import { ERROR_LEVELS } from './constants';

const telegramSender = new TelegramImageSender();
const mediaGroup = new MediaGroup();

const parentMenuItem = chrome.contextMenus.create({
    id: "myContextMenuItem",
    title: "Anime Art Forwarder",
    contexts: ["image"],
    documentUrlPatterns: [
        "*://danbooru.donmai.us/posts/*",
        "*://rule34.xxx/index.php?page=post&s=view&id=*"
    ]
});

chrome.contextMenus.create({
    id: "sendThisImage",
    parentId: parentMenuItem,
    title: "Send this image",
    contexts: ["image"],
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'send-media') {
        try {
            // POST request to telegram
            telegramSender.sendMedia(message.data).then(response => {
                // Send response from telegram api
                sendResponse(response)

                if (response.level === ERROR_LEVELS.SUCCESS) {
                    // Send event to all tabs for updating vars
                    chrome.tabs.query({}, tabs => {
                        for (const tab of tabs) {
                            chrome.tabs.sendMessage(tab.id, { type: 'clear-local-storage', data: {} });
                            updateCount(0);
                        }
                    });
                }
            });
        } catch (error) {
            console.error(error);
            sendResponse({ level: ERROR_LEVELS.ERROR, error });
        }
        return true
    }

    if (message && message.type === 'update-group') {
        const { mediaItem } = message.data
        mediaGroup.getMediaGroup()
            .then(response => {
                const mediaCount = response.length;
                const isMediaExists = response.find(item => item.mediaUrl === mediaItem.mediaUrl);

                const operationPromise = isMediaExists
                    ? mediaGroup.removeMedia(mediaItem.mediaUrl)
                    : mediaGroup.addMedia(mediaItem);

                operationPromise.then(result => {
                    const countDelta = isMediaExists ? -1 : 1;
                    if (result.level === ERROR_LEVELS.SUCCESS) updateCount(mediaCount + countDelta);
                    sendResponse(result);
                });
            }).catch(console.error);

        return true;
    }
});

function updateCount(count) {
    chrome.action.setBadgeText({
        text: count !== undefined && count > 0 ? count.toString() : ''
    });

    chrome.tabs.query({}, tabs => {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { type: 'update-count', data: { count } });
        }
    });
}
