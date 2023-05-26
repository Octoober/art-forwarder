<script>
import { inject } from 'vue';

export default {
    props: {
        mediaUrl: String,
        hashTags: Array,
        mediaGroup: Object
    },
    setup(props) {
        const isAddingToGroup = inject('isAddingToGroup');

        async function updateGroupMedia() {
            try {
                const mediaItem = {
                    type: 'photo',
                    mediaUrl: props.mediaUrl,
                    caption: props.hashTags.join(' ')
                };

                const updatedGroup = isAddingToGroup.value
                    ? await props.mediaGroup.removeMedia(props.mediaUrl)
                    : await props.mediaGroup.addMedia(mediaItem);

                if (updatedGroup.success) {
                    isAddingToGroup.value = !isAddingToGroup.value;
                    chrome.runtime.sendMessage({type: 'update-group'});
                }
            } catch (error) {
                console.log(error)
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
