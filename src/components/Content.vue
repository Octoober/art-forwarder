<script>
import { ref, onMounted } from 'vue';

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
        let mediaGroupCouner = ref(0);
        let isSendProcess = ref(false);

        const mediaGroup = new MediaGroup()

        /**
         * Отправляет коллекциб в телеграм. Добавляет текущее медиа в коллекцию и отправляет.
         */
        async function sendImageToTelegram() {
            if (!isSendProcess) return;
            isSendProcess.value = true;

            console.clear()

            try {
                const mediaUrl = getImageUrlBySelector(SELECTORS.image);
                const tags = getHashtags(SELECTORS.tags);
                let group = await mediaGroup.getMediaGroup();

                group = group.length !== 0 ? group : [{ type: 'photo', mediaUrl, caption: tags.join(' ') }];

                chrome.runtime.sendMessage({ type: 'send-media', data: group }, response => {
                    console.log('response:', response);
                    if (response.success) {
                        isSendProcess.value = false;
                    }
                });

            } catch (error) {
                // TODO: Отображать ошибки на странице
                console.error(error)
            }
        }

        async function updateGroupMedia() {
            try {
                const mediaUrl = getImageUrlBySelector(SELECTORS.image);
                const tags = getHashtags(SELECTORS.tags);
                const mediaItem = {
                    type: 'photo',
                    mediaUrl: mediaUrl,
                    caption: tags.join(' ')
                };

                const { success } = isAddedToGroup.value
                    ? await mediaGroup.removeMedia(mediaUrl)
                    : await mediaGroup.addMedia(mediaItem);

                if (success) {
                    isAddedToGroup.value = !isAddedToGroup.value;
                }

                await updateMediaGroupCounter();

            } catch (error) {
                console.log(error)
            }
        }

        function clearLocalStorage() {
            chrome.storage.local.clear(() => {
                console.log('Storage clear')
            });
        }

        function updateParentPosition() {
            const imageElement = document.querySelector(SELECTORS.image);
            if (!imageElement) return;

            const imageRect = imageElement.getBoundingClientRect();
            const parentElement = document.querySelector('#AAF');

            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            parentElement.style.left = imageRect.right - 80 + scrollX + 'px';
            parentElement.style.top = imageRect.top + 10 + scrollY + 'px';

            parentElement.style.display = 'block';
        }

        async function updateMediaGroupCounter() {
            const group = await mediaGroup.getMediaGroup();
            mediaGroupCouner.value = group.length;
        }

        async function init() {
            const mediaUrl = getImageUrlBySelector(SELECTORS.image);
            const isExists = (await mediaGroup.getMediaGroup()).find(item => item.mediaUrl === mediaUrl);
            isAddedToGroup.value = !!isExists;
        }

        function updateTabs() {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.type !== 'tabs-update') return;

                chrome.storage.local.clear(() => {
                    console.log('Storage clear')
                    isAddedToGroup.value = false;
                });
            });
        }

        onMounted(async () => {
            await init();
            updateTabs();

            updateParentPosition();
            window.addEventListener('resize', updateParentPosition);
        });

        return {
            sendImageToTelegram,
            updateGroupMedia,
            isAddedToGroup,
            clearLocalStorage,
            mediaGroupCouner,
            isSendProcess,
        }
    }
}
</script>

<template>
    <!-- TODO: все эелементы разбить на отдельные компоненты -->
    <div>
        <!--
            Отправляет текущее изображение
            ! Если группа уже существует - отправляет только содержимое группы, не доавляя в неё текущее изображение.
            TODO: ужно поменять текст на "Send {count} to telegram" в "count" подставлять кл-во медиа в группе.
            TODO: короче говоря, нужно как-то уведомить, что в группе уже есть N медиа.
        -->
        <div @click="sendImageToTelegram" class="aaf-button" :class="{ 'sending-process': isSendProcess }">Send to telegram
        </div>
        <br>

        <!--
            TODO: менять на "Remove" после добавления в группу.
        -->
        <div @click="updateGroupMedia" class="aaf-button">
            <div v-if="isAddedToGroup">remove</div>
            <div v-else>add</div>
        </div>
        <br>
        <br><br>
        <!--
            TODO: показываеть только если существует группа
        -->
        <div v-show="true" @click="clearLocalStorage" class="aaf-button clear-storage">clear all</div>
    </div>

    <!-- example -->
    <div v-if="false">
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
    </div>
</template>

<style lang="scss">
.anime-art-forwarder {
    display: none;
    position: absolute;
    padding: 0 5px 7px 5px;
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: .8;
    transition-delay: .5s;
    z-index: 10000;
    background-color: rgba($color: #000000, $alpha: .5);
    transform: scale(0.8);

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

.aaf-button {
    display: grid;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    line-height: 1.2;
    background-color: #fff;
    cursor: pointer;
    color: #111;
    padding: 10px;
    border: 1px solid #111;

    &:hover {
        background-color: #b7b7b7;
    }
}

.sending-process {
    cursor: no-drop;
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

    &__item {}

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
