<script>
import { inject } from 'vue';
import { ERROR_LEVELS } from '../../constants';

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

                const response = await chrome.runtime.sendMessage({ type: 'update-group', data: { mediaItem } })

                if (response.level === ERROR_LEVELS.SUCCESS) isAddingToGroup.value = !isAddingToGroup.value;
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
