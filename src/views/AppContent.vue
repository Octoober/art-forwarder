<script>
import { ref, reactive, provide, onMounted } from 'vue';
import { ERROR_LEVELS, SELECTORS } from '../constants';
import { getImageUrlBySelector, getHashtags, positionRelativeToTarget } from '../utils/helpers';
import { MediaGroup } from '../utils/MediaGroup';

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
            const isExists = (await mediaGroup.getMediaGroup()).find(item => item.mediaUrl === mediaUrl);
            isAddingToGroup.value = !!isExists;
        }

        function clearLocalStorage(message) {
            console.log(message);
            if (message.data.level === ERROR_LEVELS.SUCCESS) {
                chrome.storage.local.clear(() => {
                    isAddingToGroup.value = false;
                    console.log('The storage has been cleared');
                });
            }
        }

        async function updateCount(message) {
            mediaCount.value = (await mediaGroup.getMediaGroup()).length;
        }

        function updateTabs(callback) {
            chrome.runtime.onMessage.addListener((message, sender, sendRequest) => {
                if (message.type !== 'update-tabs') return;
                callback(message);
            });
        }

        const showNoti = () => {
            console.log(notifications.value);
        }

        onMounted(async () => {
            await isMediaExists();
            updateCount();
            updateTabs(clearLocalStorage)
            updateTabs(updateCount)

            const mediaElement = document.querySelector(SELECTORS.image);
            const uiWrapperElement = document.querySelector('.aaf-ui-wrapper');
            positionRelativeToTarget(uiWrapperElement, mediaElement);
            if (mediaElement) document.querySelector('#AAF').style.display = 'block';
        });

        return {
            showNoti,
            mediaGroup,
            mediaCount,
            isAddingToGroup,
            isSending,
            mediaUrl,
            hashTags,
            notifications: notifications
        };
    },
    components: { SendToTelegram, AddToGroup, MediaCount, NotificationMessage }
}
</script>

<template>
    <div class="aaf-ui-wrapper">
        <MediaCount v-if="mediaCount > 0">{{ mediaCount }}</MediaCount>
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
