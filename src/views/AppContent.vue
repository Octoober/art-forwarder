<script>
import { ref, reactive, provide, onMounted } from 'vue';
import { SELECTORS } from '../constants';
import { getMediaUrlBySelector, getHashtags, positionRelativeToTarget } from '../utils/helpers';
import { MediaGroup } from '../services/MediaGroup';

import SendToTelegram from './components/SendToTelegram.vue';
import AddToGroup from './components/AddToGroup.vue';
import MediaCount from './components/MediaCount.vue';
import NotificationMessage from './components/NotificationMessage.vue';


export default {
    setup() {
        const mediaGroup = new MediaGroup();
        const mediaUrl = getMediaUrlBySelector(SELECTORS.image);
        const hashTags = getHashtags(SELECTORS.tags);
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
        }

        const state = reactive(Object.assign({}, defaultState));

        provide('state', state);
        provide('notifications', notifications);


        async function init() {
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
            const isExists = (await mediaGroup.getMediaGroup()).find(item => item.url === mediaUrl);
            state.isAddingToGroup = !!isExists;
        }

        function updateContent({ data }) {
            Object.assign(state, data)
            console.log(state);
        }

        function clearStorage() {
            chrome.runtime.sendMessage({ type: 'clear-local-storage' });
        }

        function resetToDefault() {
            Object.assign(state, defaultState);
        }

        onMounted(async () => {
            init();

            const mediaElement = document.querySelector(SELECTORS.image);
            const uiWrapperElement = document.querySelector('.aaf-ui-wrapper');

            positionRelativeToTarget(uiWrapperElement, mediaElement);
            if (mediaElement) document.querySelector('#AAF').style.display = 'block';

            window.addEventListener('resize', () => {
                positionRelativeToTarget(uiWrapperElement, mediaElement);
            });
        });

        return {
            state,
            mediaGroup,
            sourceUrl,
            mediaUrl,
            hashTags,
            notifications,

            clearStorage
        };
    },

    components: { SendToTelegram, AddToGroup, MediaCount, NotificationMessage }
}
</script>

<template>
    <!--
        -----------------------------------------------

                 I will definitely become beautiful...
                /
            ಥ_ಥ

        -------------------------------------------------
    -->
    <div class="aaf-ui-wrapper">
        <send-to-telegram :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags" :sourceUrl="sourceUrl" />
        <br>
        <add-to-group :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags" :sourceUrl="sourceUrl" />

        <div v-if="state.mediaCount > 0">
            <br><br>
            <button @click="clearStorage">clear storage ({{ state.mediaCount }})</button>
        </div>
    </div>

    <notification-message :notifications="notifications" />
</template>

<style lang="scss">
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
