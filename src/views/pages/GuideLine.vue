<script>
export default {
    setup() {
        let version = 'empty';

        if (chrome && chrome.runtime && chrome.runtime.getManifest) {
            version = chrome.runtime.getManifest().version_name;
        }

        return {
            version
        }
    }
}
</script>

<template>
    <header class="header">
        <div class="container">
            <img src="icons/icon_128.png" alt="" class="header__logo">
            <h1 class="header__title">Thank you for the installation!</h1>
            <div class="header__version">{{ version }}</div>
        </div>
    </header>

    <div class="content">
        <div class="container">
            <div class="guide-line">
                <div class="guide-line__item">
                    <h2 class="guide-line__title">Steps to set up the bot:</h2>
                    <ol>
                        <li>Create a Telegram bot following the instructions provided by <a href="https://t.me/BotFather">@BotFather</a>.</li>
                        <li>Add the created bot to your Telegram channel and grant it permission to post messages.</li>
                    </ol>
                </div>

                <div class="guide-line__item">
                    <h2 class="guide-line__title">Steps to configure the extension in your browser:</h2>
                    <ol>
                        <li>Copy the API key provided by <a href="https://t.me/BotFather">@BotFather</a> and paste it into the "Token Key" field in the extension settings.</li>
                        <li>In the "Chat ID" field, specify the public name of your channel in the format <b>@channelName</b>.</li>
                    </ol>
                </div>

                <div class="guide-line__item">
                    <h2 class="guide-line__title">If your channel is private:</h2>
                    <ol>
                        <li>Send any message in the channel or group where your bot is present.</li>
                        <li>Open a web browser and enter the following URL, replacing <b>YOUR_BOT_TOKEN</b> with your actual bot's API token:
                            <br>
                            <code>https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates</code>
                        </li>
                        <li>In the response, find the chat object that corresponds to your channel or group. Inside this object,
                            there will be an id field, which represents the <b>Chat ID</b> of your channel or group.</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: center;
    text-align: center;
    padding-top: 20px;

    &__logo {
        width: 100px;
        margin-bottom: 5px;
    }

    &__title {
        font-size: 24px;
        font-weight: normal;
    }

    &__version {
        font-size: 13px;
        color: #858B99;
    }
}

.content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 100px;
}

.guide-line {
    &__item {
        margin-bottom: 24px;
    }

    &__title {
        font-size: 16px;
        font-weight: bold;
    }

    li {
        font-size: 18px;
    }
}</style>
