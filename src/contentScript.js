import { createApp } from 'vue';
import Content from './components/Content.vue';

function createWrapper() {
    const extensionUiWrapper = document.createElement('div');
    extensionUiWrapper.classList.add('anime-art-forwarder');
    extensionUiWrapper.id = 'AAF'
    document.body.prepend(extensionUiWrapper);
}

window.onload = () => {
    createWrapper()
    createApp(Content).mount('#AAF')

    const wrapperElement = document.querySelector('#AAF');
    // wrapperElement.style.left = document.documentElement.clientWidth - (wrapperElement.offsetWidth + 10) + 'px'

}
