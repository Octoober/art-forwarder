<script>
import { inject } from 'vue';
import { ERROR_LEVELS, MEDIA_TYPES } from '../../constants';
import { Notification } from '../../models/Notification';
import { MediaItem } from '../../models/MediaItem';

export default {
    props: {
        mediaUrl: String,
        hashTags: Array,
        mediaGroup: Object,
        sourceUrl: String,
    },
    setup(props) {
        const isAddingToGroup = inject('isAddingToGroup');
        const notifications = inject('notifications');

        async function updateGroupMedia() {
            try {
                const mediaItem = new MediaItem(MEDIA_TYPES.PHOTO, props.mediaUrl, 'test caption', props.hashTags, props.sourceUrl);
                const response = await chrome.runtime.sendMessage({ type: 'update-group', data: { mediaItem } });

                if (response.level === ERROR_LEVELS.SUCCESS) {
                    isAddingToGroup.value = !isAddingToGroup.value;
                } else {
                    notifications.value.push(response);
                }

            } catch (error) {
                console.error(error);
                notifications.value.push(new Notification(ERROR_LEVELS.ERROR, error));
            }
        }
        return {
            isAddingToGroup,
            updateGroupMedia
        }
    }
}
</script>

<template>
    <button @click="updateGroupMedia" class="aaf-button">
        <div v-if="isAddingToGroup">remove</div>
        <div v-else>add</div>
    </button>
</template>

<style lang="scss" scoped></style>
