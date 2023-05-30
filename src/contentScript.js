import { createApp } from 'vue';
import AppContent from './views/AppContent.vue';

function createWrapper() {
    const extensionUiWrapper = document.createElement('div');
    extensionUiWrapper.classList.add('anime-art-forwarder');
    extensionUiWrapper.id = 'AAF'
    extensionUiWrapper.style.display = 'none';
    document.body.prepend(extensionUiWrapper);
}

window.onload = () => {
    createWrapper()
    createApp(AppContent).mount('#AAF')
}
