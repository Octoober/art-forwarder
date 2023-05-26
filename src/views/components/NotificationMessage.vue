<template>
    <div class="notification-list" v-if="notifications.length">
        <div v-for="(notification, index) in notifications" :key="index">
            <div :class="`notification notification--${notification.level}`">
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
$successColor: #2ecc71;
$errorColor: #e74c3c;
$warningColor: #e67e22;

.notification-list {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 1000;
}

.notification {
    background-color: gray;
    padding: 10px 15px;
    color: #fff;
    margin-top: 1px;

    &--success {
        background-color: $successColor;
    }

    &--error {
        background-color: $errorColor;
    }

    &--warning {
        background-color: $warningColor;
    }
}
</style>
