<script>
import { inject } from 'vue';
import { MEDIA_TYPES, TAGS } from '../../constants';
import { MediaItem } from '../../models/MediaItem';

export default {
    props: {
        mediaUrl: String,
        hashTags: Array,
        mediaGroup: Object
    },
    setup(props) {
        const isSending = inject('isSending');
        const mediaCount = inject('mediaCount');
        const notifications = inject('notifications');

        async function sendImageToTelegram() {
            try {
                isSending.value = true;
                let group = await props.mediaGroup.getMediaGroup();
                const mediaItem = new MediaItem(MEDIA_TYPES.PHOTO, props.mediaUrl, props.hashTags.join(' '), '');

                group = group.length !== 0 ? group : [mediaItem];

                chrome.runtime.sendMessage({ type: 'send-media', data: group }, response => {
                    notifications.value.push(response);
                    isSending.value = false;
                });

            } catch (error) {
                console.error(error)
            }
        }

        return {
            isSending,
            mediaCount,
            sendImageToTelegram
        }
    }
}
</script>

<template>
    <button @click.async="sendImageToTelegram" :disabled="isSending">
        <div v-if="mediaCount > 0">Send group to Telegram</div>
        <div v-else>Send this</div>
    </button>
</template>

<style lang="scss" scoped></style>
