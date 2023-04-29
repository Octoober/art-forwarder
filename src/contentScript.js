const selectors = {
    image: ['img#image', 'img.fit-width'],
    tags: {
        character: [
            'li.tag-type-4',
            'li.tag-type-character.tag'
        ],
        copyright: [
            'li.tag-type-copyright.tag',
            'li.tag-type-3'
        ]
    }
};

const toHashtag = text => {
    return '#' + text.replace(/[\(].*?[\)]/g, '')
        .replace(/[^\w\s]|_/g, '')
        .trim().replace(/\s+/g, '_').toLowerCase();
};

function createButton() {
    const parentElement = document.querySelector('body');
    const downloadButton = document.createElement('button');

    downloadButton.style.position = 'fixed';
    downloadButton.style.right = '10px';
    downloadButton.style.top = '10px';

    downloadButton.textContent = 'Send To My Channel';

    parentElement.appendChild(downloadButton);

    return downloadButton
};

function getImageUrl() {
    for (const item of selectors.image) {
        const imageElement = document.querySelector(item);
        if (imageElement.src) {
            return imageElement.src;
        }
    }
    return null;
}


function getHashtagsArray() {
    const generate = selectorsArray => {
        let tags = []
        for (const item of selectorsArray) {
            const tagsParentElement = document.querySelectorAll(item);

            if (tagsParentElement) {
                for (const tagParrentElement of tagsParentElement) {
                    const tagElements = tagParrentElement.querySelectorAll('a');
                    tags.push(toHashtag(tagElements[1].innerText));
                }
            }
        }
        return tags
    }

    return {
        copyrights: generate(selectors.tags.copyright),
        characters: generate(selectors.tags.character)
    }
};

async function sendImageToTelegram(photoUrl, hashtagsArray) {
    const { tgToken, chatId } = await new Promise(resolve => {
        chrome.storage.sync.get(['tgToken', 'chatId'], resolve);
    });

    if (!tgToken || !chatId) {
        console.log('Missing Telegram API key or chat ID');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.telegram.org/bot${tgToken}/sendPhoto`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const captionText = Object.values(hashtagsArray).flat().join(' ');
    const requestBody = JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption: captionText
    });

    xhr.onload = () => {
        console.log('Image share success');
    }

    xhr.send(requestBody);
};

const downloadButton = createButton();
const imageUrl = getImageUrl()

downloadButton.addEventListener('click', function () {
    if (imageUrl) {
        const hashtagsArray = getHashtagsArray();
        sendImageToTelegram(imageUrl, hashtagsArray);
    } else {
        console.error('Image url is empty');
    }
});


