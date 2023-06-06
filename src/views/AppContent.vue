<script>
import { ref, reactive, provide, onMounted } from 'vue';
import { ERROR_LEVELS, SELECTORS } from '../constants';
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

        // Indication adding to group
        const isAddingToGroup = ref(false);
        // Vars for blocking UI in process sending
        const isSending = ref(false);
        // Number of media in the group
        const mediaCount = ref(0);
        // Message for notification
        const notifications = ref([]);

        provide('notifications', notifications)
        provide('mediaCount', mediaCount);
        provide('isAddingToGroup', isAddingToGroup);
        provide('isSending', isSending);

        async function isMediaExists() {
            const isExists = (await mediaGroup.getMediaGroup()).find(item => item.url === mediaUrl);
            isAddingToGroup.value = !!isExists;
        }

        function initEvents() {
            chrome.runtime.onMessage.addListener((message, sender, sendRequest) => {
                if (message.type === 'update-count') {
                    mediaCount.value = message.data.count;
                }

                if (message.type === 'reset-to-default') resetToDefault();
            });
        }

        function clearStorage() {
            chrome.runtime.sendMessage({ type: 'clear-local-storage' });
        }

        function resetToDefault() {
            isAddingToGroup.value = false;
            mediaCount.value = 0;
        }

        async function updateCount() {
            mediaCount.value = (await mediaGroup.getMediaGroup()).length;
        }

        onMounted(async () => {
            await isMediaExists();
            await updateCount();
            initEvents();

            const mediaElement = document.querySelector(SELECTORS.image);
            const uiWrapperElement = document.querySelector('.aaf-ui-wrapper');

            positionRelativeToTarget(uiWrapperElement, mediaElement);
            if (mediaElement) document.querySelector('#AAF').style.display = 'block';

            window.addEventListener('resize', () => {
                positionRelativeToTarget(uiWrapperElement, mediaElement);
            });
        });

        return {
            sourceUrl,
            mediaGroup,
            mediaCount,
            isSending,
            mediaUrl,
            hashTags,
            notifications: notifications,
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
        <MediaCount>{{ mediaCount }}</MediaCount>
        <br>
        <button @click="clearStorage">clear storage</button>
        <br>
        <SendToTelegram :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags" :sourceUrl="sourceUrl"></SendToTelegram>
        <br>
        <AddToGroup :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags" :sourceUrl="sourceUrl"></AddToGroup>
    </div>
    <notification-message :notifications="notifications"></notification-message>
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
