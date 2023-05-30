<script>
import { inject } from 'vue';
import { TAGS } from '../../constants';

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

                const mediaUrl = props.mediaUrl;
                const hashTags = TAGS ? props.hashTags.join(' ') : '';
                let group = await props.mediaGroup.getMediaGroup();

                group = group.length !== 0 ? group : [{ type: 'photo', mediaUrl, caption: hashTags }];

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
        <div v-if="mediaCount > 0">Send group to telegram</div>
        <div v-else>Send this</div>
    </button>
</template>

<style lang="scss" scoped></style>
