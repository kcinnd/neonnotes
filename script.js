// Define the necessary variables and constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const flashlightSize = 50;
const noteSize = 100;
const notes = []; // Array to hold note objects
let mouseX = 0;
let mouseY = 0;
const clickedAreas = []; // Array to hold permanently lit areas
const beamColors = [
    ['rgba(255, 7, 58, 1)', 'rgba(255, 7, 58, 0)'],
    ['rgba(189, 0, 255, 1)', 'rgba(189, 0, 255, 0)'],
    ['rgba(0, 145, 255, 1)', 'rgba(0, 145, 255, 0)'],
    ['rgba(0, 255, 25, 1)', 'rgba(0, 255, 25, 0)'],
    ['rgba(255, 0, 110, 1)', 'rgba(255, 0, 110, 0)'],
    ['rgba(255, 255, 0, 1)', 'rgba(255, 255, 0, 0)'],
    ['rgba(0, 255, 255, 1)', 'rgba(0, 255, 255, 0)'],
    ['rgba(255, 165, 0, 1)', 'rgba(255, 165, 0, 0)'],
    ['rgba(204, 51, 255, 1)', 'rgba(204, 51, 255, 0)'],
    ['rgba(191, 255, 0, 1)', 'rgba(191, 255, 0, 0)'],
    ['rgba(64, 224, 208, 1)', 'rgba(64, 224, 208, 0)'],
    ['rgba(255, 0, 255, 1)', 'rgba(255, 0, 255, 0)'],
    ['rgba(255, 215, 0, 1)', 'rgba(255, 215, 0, 0)'],
    ['rgba(148, 0, 211, 1)', 'rgba(148, 0, 211, 0)'],
    ['rgba(135, 206, 235, 1)', 'rgba(135, 206, 235, 0)'],
    ['rgba(255, 111, 97, 1)', 'rgba(255, 111, 97, 0)'],
    ['rgba(75, 0, 130, 1)', 'rgba(75, 0, 130, 0)'],
    ['rgba(252, 142, 172, 1)', 'rgba(252, 142, 172, 0)'],
    ['rgba(0, 255, 195, 1)', 'rgba(0, 255, 195, 0)'],
];
let currentColorIndex = 0; // To cycle through beam colors
let flashlightColor = beamColors[currentColorIndex][0]; // Initial flashlight color

// Resize canvas to fill window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to randomly place musical notes on the canvas
function placeNotes() {
    for (let i = 0; i < 10; i++) { // Create 10 notes for demonstration
        const note = {
            x: Math.random() * (canvas.width - noteSize),
            y: Math.random() * (canvas.height - noteSize),
            revealed: false,
            playing: false
        };
        notes.push(note);
    }
}

// Function to draw the scene
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each note, if it's revealed
    notes.forEach(note => {
        if (note.revealed) {
            ctx.fillStyle = 'white'; // Color for revealed notes
            ctx.fillRect(note.x, note.y, noteSize, noteSize); // Placeholder for actual note images
        }
    });

    // Light up previously clicked areas
    clickedAreas.forEach(area => {
        const gradient = ctx.createRadialGradient(area.x, area.y, 0, area.x, area.y, flashlightSize);
        gradient.addColorStop(0, beamColors[area.colorIndex][0]);
        gradient.addColorStop(1, beamColors[area.colorIndex][1]);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(area.x, area.y, flashlightSize, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw flashlight effect at the current mouse position
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, flashlightSize);
    gradient.addColorStop(0, flashlightColor);
    gradient.addColorStop(1, beamColors[currentColorIndex][1]);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, flashlightSize, 0, 2 * Math.PI);
    ctx.fill();

    // Loop the draw function
    requestAnimationFrame(draw);
}

// Function to handle mouse movement
function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

// Function to handle canvas clicks
function handleClick(event) {
    const clickX = event.clientX;
    const clickY = event.clientY;

    // Store clicked area for permanent lighting
    clickedAreas.push({ x: clickX, y: clickY, colorIndex: currentColorIndex });

    // Cycle through flashlight colors
    currentColorIndex = (currentColorIndex + 1) % beamColors.length;
    flashlightColor = beamColors[currentColorIndex][0];

    notes.forEach(note => {
        if (
            clickX >= note.x && clickX <= note.x + noteSize &&
            clickY >= note.y && clickY <= note.y + noteSize
        ) {
            note.revealed = true;

            // Toggle music playback for the note
            if (!note.playing) {
                // Play music logic here
                note.playing = true;
            } else {
                // Pause music logic here
                note.playing = false;
            }
        }
    });
}

// Initialization function
function init() {
    placeNotes();
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    draw();
}

init();
