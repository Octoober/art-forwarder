<script>
import { TelegramImageSender } from '../utils/TelegramImageSender';
import TelegramIcon from './icons/Telegram';
import { SELECTORS } from '../constants';
import { getImageUrlBySelector, getHashtagsArray, saveToCollection } from '../utils/helpers';

export default {
    components: {
        TelegramIcon
    },
    setup() {
        /**
         * Отправляет коллекциб в телеграм. Добавляет текущее медиа в коллекцию и отправляет.
         */
        async function sendImageToTelegram() {
            console.clear()
            // const tagString = getHashtagsArray(selectors.tags.character).concat(getHashtagsArray(selectors.tags.copyright)).join(' ');
            try {
                // const tagsString = [...tags].join(' ');
                // Remove duplicate tags
                // const tags = new Set([...getHashtagsArray(selectors.tags.character), ...getHashtagsArray(selectors.tags.copyright)]);
                const telegramSender = new TelegramImageSender()

                await this.addToCollectionTest();

                const { postCollection } = await chrome.storage.local.get('postCollection');
                telegramSender.sendImage(postCollection)
            } catch (error) {
                // TODO: Отображать ошибки на странице
                console.error(error)
            }
        }

        async function addToCollectionTest() {
            try {
                const media = getImageUrlBySelector(SELECTORS.image);
                await saveToCollection(window.location.href, 'photo', media, 'test caption');
            } catch (error) {
                console.log('test error')
            }
        }

        return {
            sendImageToTelegram,
            addToCollectionTest
        }
    }
}
</script>

<template>
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
                        <button @click="addToCollectionTest" class="button button--sub">+</button>
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
    right: 0;
    // left: calc(100% - 130px);
    padding: 0 5px 7px 5px;
    user-select: none;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    opacity: .7;
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
        .button {
            &--main {
                position: relative;
                z-index: 1;
            }
        }
    }

    &__sub-list {
        text-align: center;

        &:hover .button {
            background-color: red;
        }
    }

    &__sub-item {
        transition: .2s;
        transition-delay: .5s;
        margin-top: calc(-50% - 30px / 2);
    }
}
</style>
