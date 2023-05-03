import './popup.scss';

(function () {
    const tokenInput = document.querySelector('input.tg-token');
    const chatIdInput = document.querySelector('input.chat-id');
    const saveButton = document.querySelector('button.save');

    function showNotification(message, typeClass = '', delay = 3000) {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification', typeClass);

        notificationElement.textContent = message;

        document.body.appendChild(notificationElement);

        setTimeout(() => {
            notificationElement.remove();
        }, delay);
    }

    function saveConfig() {
        const botToken = tokenInput.value;
        const chatId = chatIdInput.value;

        if (!botToken || !chatId) {
            showNotification('Token and chat ID cannot be empty.', 'error');
            return;
        }
        if (botToken.length < 46 || chatId.length < 4) {
            showNotification('Token or Chat ID incorrect.', 'error');
            return;
        }

        chrome.storage.sync.set({ botToken, chatId }, (error) => {
            if (error) {
                console.error(error);
                return;
            }

            showNotification('Token or Chat ID incorrect.', 'success');
        });
    };

    function restoreConfig() {
        chrome.storage.sync.get(['botToken', 'chatId'], ({ botToken, chatId }) => {
            if (chrome.runtime.lastError) {
                // show popup notify
                console.error(chrome.runtime.lastError);
                return;
            }

            if (botToken && chatId) {
                tokenInput.value = botToken;
                chatIdInput.value = chatId;
            }
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        restoreConfig();
        saveButton.addEventListener('click', saveConfig);
    });
})();
