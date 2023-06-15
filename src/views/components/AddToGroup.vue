<script>
import { inject } from 'vue';
import { ERROR_LEVELS, MEDIA_TYPES } from '../../constants';
import { Notification } from '../../models/Notification';
import { MediaItem } from '../../models/MediaItem';

export default {
    props: {
        mediaGroup: Object,
        mediaItem: Object,
    },
    setup(props) {
        const state = inject('state');
        const notifications = inject('notifications');

        async function updateGroupMedia() {
            try {
                const response = await chrome.runtime.sendMessage({
                    type: 'update-group',
                    data: { mediaItem: props.mediaItem }
                });

                if (response.level === ERROR_LEVELS.SUCCESS) {
                    state.isAddingToGroup = !state.isAddingToGroup;
                } else {
                    notifications.value.push(response);
                }

            } catch (error) {
                console.error(error);
                notifications.value.push(new Notification(ERROR_LEVELS.ERROR, error));
            }
        }
        return {
            state,
            updateGroupMedia
        }
    }
}
</script>

<template>
    <button @click="updateGroupMedia" class="aaf-button">
        <div v-if="state.isAddingToGroup">remove</div>
        <div v-else>add</div>
    </button>
</template>

<style lang="scss" scoped></style>
