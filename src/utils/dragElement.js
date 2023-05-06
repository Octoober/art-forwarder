function createWrapper(draggableElement) {
    let mouseX = 0;
    let mouseY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    document.addEventListener('mousedown', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const boundingRect = draggableElement.getBoundingClientRect();
        offsetX = mouseX - boundingRect.left;
        offsetY = mouseY - boundingRect.top;

        isDragging = true;
    });

    // TODO: элемент передвигается рывками, нужно попробовать вариант с requestAnimationFrame
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const elementWidth = draggableElement.offsetWidth;
        const elementHeight = draggableElement.offsetHeight;

        const isYInside = (newY >= 0) && ((newY + elementHeight) <= windowHeight);
        const isXInside = (newX >= 0) && ((newX + elementWidth) <= windowWidth);

        draggableElement.style.top = newY + 'px';
        draggableElement.style.left = newX + 'px';

        if (isYInside && isXInside) {
        } else {
            if (!isYInside) {
                if (newY < 0) {
                    draggableElement.style.top = 0;
                } else {
                    draggableElement.style.top = windowHeight - elementHeight + 'px';
                }
            }
            if (!isXInside) {
                if (newX < 0) {
                    draggableElement.style.left = 0;
                } else {
                    draggableElement.style.left = windowWidth - elementWidth + 'px';
                }
            }
        }
    })

    document.addEventListener('mouseup', () => {
        isDragging = false;
    })

    return extensionUiWrapper;
}
