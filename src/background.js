// TODO: Code refactoring is needed

import { TelegramMediaSender } from './services/TelegramMediaSender';
import { MediaGroup } from "./services/MediaGroup";
import { ERROR_LEVELS } from './constants';
import { Notification } from './models/Notification';

const telegramSender = new TelegramMediaSender();
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
                    chrome.storage.local.clear(() => {
                        updateCount(0);
                        chrome.tabs.query({}, tabs => {
                            for (const tab of tabs) {
                                chrome.tabs.sendMessage(tab.id, { type: 'reset-to-default' });
                            }
                        });
                    });
                }
            });
        } catch (error) {
            console.error(error);
            sendResponse(new Notification(ERROR_LEVELS.ERROR, error))
        }
        return true
    }

    if (message && message.type === 'update-group') {
        const { mediaItem } = message.data
        mediaGroup.getMediaGroup()
            .then(response => {
                const mediaCount = response.length;
                const isMediaExists = response.find(item => item.url === mediaItem.url);

                const operationPromise = isMediaExists
                    ? mediaGroup.removeMedia(mediaItem.url)
                    : mediaGroup.addMedia(mediaItem);

                operationPromise.then(result => {
                    const countDelta = isMediaExists ? -1 : 1;
                    if (result.level === ERROR_LEVELS.SUCCESS) updateCount(mediaCount + countDelta);
                    sendResponse(result);
                });
            }).catch(console.error);

        return true;
    }

    if (message && message.type === 'clear-local-storage') {
        chrome.storage.local.clear(() => {
            updateCount(0);
            chrome.tabs.query({}, tabs => {
                for (const tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { type: 'reset-to-default' });
                }
            });
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    mediaGroup.getMediaGroup()
        .then(response => response.length)
        .then(count => {
            chrome.action.setBadgeText({
                text: count !== undefined && count > 0 ? count.toString() : ''
            });
        })
        .catch(error => console.error);
});

function updateCount(count) {
    chrome.action.setBadgeText({
        text: count !== undefined && count > 0 ? count.toString() : ''
    });

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { type: 'update-count', data: { count } });
        }
    });
}
