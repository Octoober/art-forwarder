<script>
import { ref, reactive, provide, onMounted } from 'vue';
import { ERROR_LEVELS, SELECTORS } from '../constants';
import { getImageUrlBySelector, getHashtags, removeDuplicateTags } from '../utils/helpers';
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
    <!-- <button @click="showNoti">show</button> -->
    <!-- <br> -->
    <MediaCount>{{ mediaCount }}</MediaCount>
    <br>
    <SendToTelegram :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags"></SendToTelegram>
    <br>
    <AddToGroup :media-group="mediaGroup" :media-url="mediaUrl" :hash-tags="hashTags"></AddToGroup>

    <notification-message :notifications="notifications"></notification-message>
</template>

<style lang="scss" scoped></style>
