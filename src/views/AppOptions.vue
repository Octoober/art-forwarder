<script>
import { computed } from "vue";
import GuideLine from "./pages/GuideLine.vue";

export default {
    setup() {
        const params = new URLSearchParams(window.location.search);
        const isInstall = computed(() => params.get('install') === 'true');


        return {
            isInstall
        }
    },
    components: { GuideLine }
}
</script>

<template>
    <guide-line v-if="isInstall" />
</template>

<style lang="scss">
@import url('./styles/fonts.scss');

h1,
h2,
h3 {
    padding: 0;
    margin: 0;
}

a {
    color: #2E75FF;
    text-decoration: none;
}

code {
    font-family: 'Courier New', serif;
}

ol {
    margin: 0;
    padding-left: 28px;
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-style: normal;
    background-color: #F2F2F2;
}

.container {
    max-width: 960px;
}
</style>
