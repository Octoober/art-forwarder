(function () {
    function saveConfig() {
        const tgTokenInput = document.querySelector('input.tg-token');
        const chatIdInput = document.querySelector('input.chat-id');

        document.querySelector('button.save').addEventListener('click', () => {
            chrome.storage.sync.set({
                tgToken: tgTokenInput.value,
                chatId: chatIdInput.value
            }, function() {
                console.log('config success save');
            })
        })
    };

    function restoreConfig() {
        const tgTokenInput = document.querySelector('input.tg-token');
        const chatIdInput = document.querySelector('input.chat-id');

        chrome.storage.sync.get(['tgToken', 'chatId'], (result) => {
            console.log(result)
            if (Object.keys(result).length != 0) {
                tgTokenInput.value = result.tgToken;
                chatIdInput.value = result.chatId;
            }
        })

        saveConfig();
    };

    document.addEventListener('DOMContentLoaded', restoreConfig);
})();
