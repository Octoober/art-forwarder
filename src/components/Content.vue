<script>
import { ref, onMounted } from 'vue';

import { TelegramImageSender } from '../utils/TelegramImageSender';
import { MediaGroup } from '../utils/MediaGroup';
import TelegramIcon from './icons/Telegram';
import { SELECTORS } from '../constants';
import { getImageUrlBySelector, getHashtags, removeDuplicateTags } from '../utils/helpers';

export default {
    components: {
        TelegramIcon
    },
    setup() {
        let isAddedToGroup = ref(false);

        /**
         * Отправляет коллекциб в телеграм. Добавляет текущее медиа в коллекцию и отправляет.
         */
        async function sendImageToTelegram() {
            console.clear()

            try {
                const mediaUrl = getImageUrlBySelector(SELECTORS.image);
                const tags = getHashtags(SELECTORS.tags);

                const telegramSender = new TelegramImageSender();
                const mediaGroup = new MediaGroup();

                const mediaItem = {
                    type: 'photo',
                    mediaUrl: mediaUrl,
                    caption: tags.join(' ')
                };
                await mediaGroup.addMedia(mediaItem);
                const group = await mediaGroup.getMediaGroup();

                telegramSender.sendImage(group).then(result => {
                    console.log(result)
                    if (result.success) {
                        chrome.storage.local.clear(() => {
                            console.log('Storage clear');
                            isAddedToGroup.value = false;
                        });
                    }
                });
            } catch (error) {
                // TODO: Отображать ошибки на странице
                console.error(error)
            }
        }

        async function updateGroupMedia() {
            console.log('Added:', isAddedToGroup.value)
            try {
                const mediaUrl = getImageUrlBySelector(SELECTORS.image);
                const tags = getHashtags(SELECTORS.tags);
                const mediaGroup = new MediaGroup();
                const mediaItem = {
                    type: 'photo',
                    mediaUrl: mediaUrl,
                    caption: tags.join(' ')
                };

                if (isAddedToGroup.value) {
                    mediaGroup.removeMedia(mediaUrl).then(result => {
                        console.log(result)
                        isAddedToGroup.value = false;
                    });
                } else {
                    mediaGroup.addMedia(mediaItem).then(result => {
                        if (result.success) {
                            console.log(result)
                            isAddedToGroup.value = true;
                        }
                    });
                }

            } catch (error) {
                console.log(error)
            }
        }

        function clearLocalStorage() {
            chrome.storage.local.clear(() => {
                console.log('Storage clear')
            });
        }

        return {
            sendImageToTelegram,
            updateGroupMedia,
            isAddedToGroup,
            clearLocalStorage,
        }
    }
}
</script>

<template>
    <button @click="clearLocalStorage" class="clear-storage">Clear</button>

    <div v-show="false" class="counter">
        <div class="counter__value">4</div>
        <div class="counter__arrow-down"></div>
    </div>
    <nav class="menu">
        <ul class="menu__list">
            <li class="menu__item">
                <button @click="sendImageToTelegram" title="Send this art to Telegram" class="button button--main">
                    <TelegramIcon />
                </button>
                <ul class="menu__sub-list">
                    <li class="menu__sub-item">
                        <button @click="updateGroupMedia" class="button button--sub">
                            <div v-if="isAddedToGroup">-</div>
                            <div v-else>+</div>
                        </button>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss">
.anime-art-forwarder {
    position: fixed;
    top: 20px;
    padding: 0 5px 7px 5px;
    user-select: none;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    opacity: .8;
    transition-delay: .5s;

    &:hover {
        opacity: 1;
        transition-delay: 0s;
    }
}
</style>

<style lang="scss" scoped>

* {
    margin: 0;
    padding: 0;
    list-style: none;

    font-weight: normal;
    font-style: normal;
}

.clear-storage {
    position: fixed;
    bottom: 10px;
    padding: 5px 20px;
}

.counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    visibility: hidden;

    &__value {
        font-size: 12px;
        background-color: #fff;
        padding: 2px 13px;
        border-radius: 4px;
        text-align: center;
        box-shadow: 0 3px 5px rgba(#000, .2);
    }

    &__arrow-down {
        $_arrowWidth: 6px;
        width: 0;
        height: 0;
        border: 0 solid transparent;
        border-left-width: $_arrowWidth;
        border-right-width: $_arrowWidth;
        border-top: $_arrowWidth solid #fff;
    }
}

.button {
    background-color: #fff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    border: none;
    box-shadow: 0 4px 10px rgba(#000, .3);

    &--main {
        width: 50px;
        height: 50px;
        fill: #229ED9;
        position: relative;
        z-index: 1;
    }
    &--sub {
        color: #fff;
        background-color: #0088CC;
        font-weight: bold;
    }
}

.menu {
    &__list {
        padding: 2px 5px 3px 5px;
        position: relative;

        &:hover .menu__sub-item {
            transition-delay: 0s;
            margin-top: 3px;

            .button {}
        }
    }

    &__item {
    }

    &__sub-list {
        text-align: center;
        &:hover .button {
            background-color: #179CDE;
        }
    }

    &__sub-item {
        transition: .2s;
        transition-delay: .5s;
        margin-top: calc(-50% - 30px / 2);
    }
}
</style>
