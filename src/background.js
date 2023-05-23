import { TelegramImageSender } from './utils/TelegramImageSender';

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'send-media') {
        const telegramSender = new TelegramImageSender();

        telegramSender.sendImage(request.data)
            .then(response => {
                sendResponse(response);

                if (response.success) {
                    chrome.tabs.query({}, tabs => {
                        for (const tab of tabs) {
                            chrome.tabs.sendMessage(tab.id, { type: 'tabs-update' });
                        }
                    });
                }
            })
            .catch(error => {
                console.error(error);
                sendResponse(error);
            });
    }
    return true;
});
