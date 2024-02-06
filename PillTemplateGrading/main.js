//Function to generate bubbles
function generateBubbles(numBubbles){
    const bubbleContainer = document.querySelector('.bubbles-container')
    for (let i = 0; i< numBubbles; i++){
        const bubble = document.createElement('span')
        bubble.className = `bubble-${i}`;
        bubbleContainer.appendChild(bubble);
    }
}

generateBubbles(15)