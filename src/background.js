// TODO: Code refactoring is needed

import { TelegramMediaSender } from './services/TelegramMediaSender';
import { MediaGroup } from "./services/MediaGroup";
import { ERROR_LEVELS } from './constants';
import { Notification } from './models/Notification';

const telegramSender = new TelegramMediaSender();
const mediaGroup = new MediaGroup();

// const parentMenuItem = chrome.contextMenus.create({
//     id: "myContextMenuItem",
//     title: "Anime Art Forwarder",
//     contexts: ["image"],
//     documentUrlPatterns: [
//         "*://danbooru.donmai.us/posts/*",
//         "*://rule34.xxx/index.php?page=post&s=view&id=*"
//     ]
// });

// chrome.contextMenus.create({
//     id: "sendThisImage",
//     parentId: parentMenuItem,
//     title: "Send this image",
//     contexts: ["image"],
// });

chrome.runtime.onInstalled.addListener(setMediaGroupCount);
chrome.runtime.onStartup.addListener(setMediaGroupCount);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'send-media') {
        try {
            // POST request to telegram
            telegramSender.sendMedia(message.data).then(response => {
                // Send response from telegram api
                sendResponse(response)

                if (response.level === ERROR_LEVELS.SUCCESS) {
                    // Send event to all tabs for updating vars
                    chrome.storage.local.clear(() => {
                        if (!chrome.runtime.lastError) {
                            sendMessageToAllTabs('reset-state');
                            setBage(0);
                        }
                    });
                }
            });
        } catch (error) {
            console.error(error);
            sendResponse(new Notification(ERROR_LEVELS.ERROR, error))
        }
        return true
    }

    if (message?.type === 'update-group') {
        const { mediaItem } = message.data;

        mediaGroup.getMediaGroup()
            .then(response => {
                const mediaCount = response.length;
                const isMediaExists = response.find(item => item.url === mediaItem.url);

                const operationPromise = isMediaExists
                    ? mediaGroup.removeMedia(mediaItem.url)
                    : mediaGroup.addMedia(mediaItem);

                operationPromise.then(result => {
                    const countDelta = isMediaExists ? -1 : 1;

                    if (result.level === ERROR_LEVELS.SUCCESS) {
                        sendMessageToAllTabs('update-content', { mediaCount: mediaCount + countDelta });
                        setBage(mediaCount + countDelta);
                    }

                    sendResponse(result);
                });
            }).catch(console.error);

        return true;
    }

    if (message?.type === 'clear-local-storage') {
        chrome.storage.local.clear(() => {
            if (!chrome.runtime.lastError) {
                sendMessageToAllTabs('reset-state');
                setBage(0);
            }
        });
    }
});

function setMediaGroupCount() {
    mediaGroup.getMediaGroup()
        .then(response => response.length)
        .then(count => {
            setBage(count);
        })
        .catch(console.error);
}

async function sendMessageToAllTabs(eventType, content = {}) {
    const tags = await chrome.tabs.query({});

    const promises = tags.map(async tab => {
        try {
            await chrome.tabs.sendMessage(tab.id, { type: eventType, data: content });
        } catch (error) {
            console.warn(error);
        }
    });

    await Promise.allSettled(promises);
}

function setBage(value) {
    chrome.action.setBadgeText({
        text: value !== undefined && value > 0 ? value.toString() : ''
    });
}
