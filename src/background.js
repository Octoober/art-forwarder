import { TelegramImageSender } from './utils/TelegramImageSender';
import { ERROR_LEVELS } from './constants';

const telegramSender = new TelegramImageSender();

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
                // Send event to all tabs for updating vars
                chrome.tabs.query({}, tabs => {
                    for (const tab of tabs) {
                        chrome.tabs.sendMessage(tab.id, { type: 'update-tabs', data: response });
                    }
                });
            });
        } catch (error) {
            console.error(error);
            sendResponse({level: ERROR_LEVELS.ERROR, error});
        }
        return true
    }

    if (message.type === 'update-group') {
        chrome.tabs.query({}, tabs => {
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, { type: 'update-tabs', data: null });

                const count = message.data.count;
                chrome.action.setBadgeText({
                    text: count !== undefined && count > 0 ? count.toString() : ''
                });
            }
        });

        return true;
    }
});
