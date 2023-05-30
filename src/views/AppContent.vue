<script>
import { ref, reactive, provide, onMounted } from 'vue';
import { ERROR_LEVELS, SELECTORS } from '../constants';
import { getImageUrlBySelector, getHashtags, positionRelativeToTarget } from '../utils/helpers';
import { MediaGroup } from '../services/MediaGroup';

import SendToTelegram from './components/SendToTelegram.vue';
import AddToGroup from './components/AddToGroup.vue';
import MediaCount from './components/MediaCount.vue';
import NotificationMessage from './components/NotificationMessage.vue';


export default {
    setup() {
        const mediaGroup = new MediaGroup();
        const mediaUrl = getImageUrlBySelector(SELECTORS.image);
        const hashTags = getHashtags(SELECTORS.tags);

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
                // if (message.type === 'clear-local-storage') {
                //     chrome.storage.local.clear(() => {
                //         isAddingToGroup.value = false;
                //         console.log('The storage has been cleared');
                //     });
                // }

                if (message.type === 'update-count') {
                    mediaCount.value = message.data.count;
                }

                if (message.type === 'reset-to-default') resetToDefault();
            });
        }

        function clearStorage() {
            chrome.runtime.sendMessage({type: 'clear-local-storage'});
            // chrome.storage.local.clear(() => {
            //     isAddingToGroup.value = false;
            //     chrome.runtime.sendMessage({type: 'clear-tabs'});
            //     console.log('The storage has been cleared');
            // });
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
            updateCount();
            initEvents();

            const mediaElement = document.querySelector(SELECTORS.image);
            const uiWrapperElement = document.querySelector('.aaf-ui-wrapper');

            positionRelativeToTarget(uiWrapperElement, mediaElement);
            if (mediaElement) document.querySelector('#AAF').style.display = 'block';
        });

        return {
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
    <div class="aaf-ui-wrapper">
        <MediaCount v-if="mediaCount > 0">{{ mediaCount }}</MediaCount>
        <br>
        <button @click="clearStorage">clear storage</button>
        <br>
        <SendToTelegram :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags"></SendToTelegram>
        <br>
        <AddToGroup :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags"></AddToGroup>
    </div>
    <notification-message :notifications="notifications"></notification-message>
</template>

<style lang="scss">
.aaf-ui-wrapper {
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
    transform: scale(0.9);

    &:hover {
        opacity: 1;
        transition-delay: 0s;
    }
}
</style>
