<script>
import { inject } from 'vue';
import { MEDIA_TYPES, TAGS } from '../../constants';
import { MediaItem } from '../../models/MediaItem';

export default {
    props: {
        mediaUrl: String,
        hashTags: Array,
        mediaGroup: Object,
        sourceUrl: String,
    },
    setup(props) {
        const state = inject('state');
        const notifications = inject('notifications');

        async function sendImageToTelegram() {
            try {
                state.isSending = true;
                let group = await props.mediaGroup.getMediaGroup();

                const mediaItem = new MediaItem(MEDIA_TYPES.PHOTO, props.mediaUrl, 'test caption', props.hashTags, props.sourceUrl);

                group = group.length !== 0 ? group : [mediaItem];

                chrome.runtime.sendMessage({ type: 'send-media', data: group }, response => {
                    notifications.value.push(response);
                    state.isSending = false;
                });

            } catch (error) {
                console.error(error)
            }
        }

        return {
            state,
            sendImageToTelegram
        }
    }
}
</script>

<template>
    <button @click.async="sendImageToTelegram" :disabled="state.isSending">
        <div v-if="state.mediaCount > 0">Send group to Telegram</div>
        <div v-else>Send this</div>
    </button>
</template>

<style lang="scss" scoped></style>
