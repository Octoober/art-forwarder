// TODO

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
