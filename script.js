// Define the necessary variables and constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const flashlightSize = 50;
const noteSize = 100;
const notes = []; // Array to hold note objects
let mouseX = 0;
let mouseY = 0;
let flashlightColor = 'rgba(255, 0, 0, 0.5)'; // Initial flashlight color, red

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

    // Draw flashlight effect
    ctx.fillStyle = flashlightColor;
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

    notes.forEach(note => {
        if (
            clickX >= note.x && clickX <= note.x + noteSize &&
            clickY >= note.y && clickY <= note.y + noteSize
        ) {
            note.revealed = true;

            // Check if the entire note is revealed and toggle music playback
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
