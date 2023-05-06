import { createApp } from 'vue';
import Content from './components/Content.vue';

function createWrapper() {
    const extensionUiWrapper = document.createElement('div');
    extensionUiWrapper.classList.add('anime-art-forwarder');
    extensionUiWrapper.id = 'AAF'
    document.body.appendChild(extensionUiWrapper);
}

window.addEventListener('load', createWrapper);
createApp(Content).mount('#AAF')


