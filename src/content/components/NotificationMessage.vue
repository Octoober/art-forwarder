<template>
    <div v-if="notifications.length">
        <div v-for="(notification, index) in notifications" :key="index">
            <div :class="`notification notification--${notification.success}`">
                {{ notification.message }}
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    props: {
        notifications: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const notifications = ref([]);

        watch(props.notifications, newVal => {
            showMessage(newVal[newVal.length - 1]);
        });

        function addMessage(message) {
            notifications.value.push(message);
        }

        function removeMessage() {
            if (notifications.value.length > 0) {
                notifications.value.shift();
            }
        }

        function showMessage(message) {
            addMessage(message);
            setTimeout(removeMessage, 5000);
        }

        return {
            notifications
        }
    }
}
</script>

<style lang="scss" scoped>
.notification {
    background-color: gray;
    &--true {
        background-color: greenyellow;
        color: #000;
    }
}
</style>
