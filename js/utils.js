function getRandomBallColor(){
    return `hsl(${randomFloat(0,360)}, 80%, 50%)`;
}

function randomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}