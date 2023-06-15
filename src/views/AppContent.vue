<template>
    <!--
        -----------------------------------------------

                 I will definitely become beautiful...
                /
            ಥ_ಥ

        -------------------------------------------------
    -->
    <div class="aaf-ui-wrapper">
        <send-to-telegram :media-group="mediaGroup" :mediaItem="mediaItem" />
        <br>
        <add-to-group :media-group="mediaGroup" :mediaItem="mediaItem" />

        <div v-if="state.mediaCount > 0">
            <br><br>
            <button @click="clearStorage">clear storage ({{ state.mediaCount }})</button>
        </div>
    </div>

    <notification-message :notifications="notifications" />
    <div class="reload-extansion-button" v-if="isDevMode" @dblclick="extensionReload"><span>reload extension</span></div>
</template>

<script>
import { ref, reactive, provide, onMounted } from 'vue';

import { MediaInfoContext } from '../services/MediaInfoStrategy/MediaInfoContext';
import { DonmaiUsMediaInfo } from '../services/MediaInfoStrategy/DonmaiUs/DonmaiUsMediaInfo';
import { Rule34XxxMediaInfo } from '../services/MediaInfoStrategy/Rule34Xxx/Rule34XxxMediaInfo';

import { positionRelativeToTarget } from '../utils/helpers';
import { MediaGroup } from '../services/MediaGroup';

import SendToTelegram from './components/SendToTelegram.vue';
import AddToGroup from './components/AddToGroup.vue';
import MediaCount from './components/MediaCount.vue';
import NotificationMessage from './components/NotificationMessage.vue';

export default {
    setup() {
        const mediaGroup = new MediaGroup();
        const mediaInfoConext = new MediaInfoContext();

        const mediaItem = ref({});
        // const hashTags = getHashtags(SELECTORS.tags);
        const sourceUrl = window.location.href;

        // Message for notification
        const notifications = ref([]);

        const defaultState = {
            // Number of media in the group
            mediaCount: 0,

            // Vars for blocking UI in process sending
            isSending: false,

            // Indication adding to group
            isAddingToGroup: false
        };
        const state = reactive(Object.assign({}, defaultState));

        provide('state', state);
        provide('notifications', notifications);

        async function extensionReload() {
            await chrome.runtime.sendMessage({ type: 'extension-reload', url: location.href });
        }

        async function init() {
            const pageUrl = location.href;

            mediaInfoConext.setStrategy('danbooru.donmai.us', new DonmaiUsMediaInfo());
            mediaInfoConext.setStrategy('rule34.xxx', new Rule34XxxMediaInfo());

            try {
                mediaItem.value = mediaInfoConext.executeStrategy(pageUrl);
                console.log('MediaItem:', mediaItem.value);
            } catch (error) {
                console.log(error);
            }

            await isMediaExists();
            await updateCount();

            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                switch (message.type) {
                    case 'update-content':
                        updateContent(message);
                        break;

                    case 'reset-state':
                        resetToDefault();
                        break;

                    default:
                        console.warn(`Unknown message type: ${message.type}`);
                        break;
                }
            });
        }

        async function updateCount() {
            state.mediaCount = (await mediaGroup.getMediaGroup()).length;
        }

        async function isMediaExists() {
            const isExists = (await mediaGroup.getMediaGroup()).find(item => item.url === mediaItem.value.url);
            state.isAddingToGroup = !!isExists;
        }

        function updateContent({ data }) {
            Object.assign(state, data)
        }

        function clearStorage() {
            chrome.runtime.sendMessage({ type: 'clear-local-storage' });
        }

        function resetToDefault() {
            Object.assign(state, defaultState);
        }

        onMounted(async () => {
            init();

            const mediaElement = mediaItem.value.element;
            const uiWrapperElement = document.querySelector('.aaf-ui-wrapper');

            positionRelativeToTarget(uiWrapperElement, mediaElement);
            if (mediaElement) document.querySelector('#AAF').style.display = 'block';

            window.addEventListener('resize', () => {
                positionRelativeToTarget(uiWrapperElement, mediaElement);
            });
        });

        return {
            isDevMode: __IS_DEV_MODE__,
            extensionReload,

            state,
            mediaGroup,
            sourceUrl,
            mediaItem,
            notifications,

            clearStorage
        };
    },

    components: { SendToTelegram, AddToGroup, MediaCount, NotificationMessage }
}
</script>

<style lang="scss">
.reload-extansion-button {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #4942E4;
    color: #fff;
    width: 25px;
    z-index: 1000000;
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition-delay: .7s;
    span {
        font-size: 14px;
        white-space: nowrap;
        transform: rotate(90deg);
        user-select: none;
    }
    &:hover {
        opacity: 1;
        transition-delay: 0s;
    }
}

.aaf-ui-wrapper {
    position: absolute;
    width: 120px;
    padding: 0 5px 7px 5px;
    background-color: rgba($color: #000000, $alpha: .5);

    user-select: none;
    transition-delay: .5s;
    transform: scale(0.9);
    opacity: .8;
    z-index: 10000;

    &:hover {
        opacity: 1;
        transition-delay: 0s;
    }
}
</style>

<style lang="scss" scoped>
button {
    width: 100%;
}
</style>
