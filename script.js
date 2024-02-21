// Define the necessary variables and constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const flashlightSize = 50;
const noteSize = 100;
const noteImages = []; // Array to hold loaded note images
const notes = []; // Array to hold note objects with positions and revealed status
let mouseX = 0;
let mouseY = 0;
const clickedAreas = []; // Array to hold permanently lit areas
const noteUrls = [ // URLs of the note images
    "https://i.imgur.com/CJ09TQq.png", "https://i.imgur.com/b5fsfMv.png", "https://i.imgur.com/iAKvZfs.png",
    "https://i.imgur.com/qBMF0fz.png", "https://i.imgur.com/OGFu1Le.png", "https://i.imgur.com/iEUHvIc.png",
    "https://i.imgur.com/14w5V4V.png", "https://i.imgur.com/U0aP5pi.png", "https://i.imgur.com/ZbZ7sqd.png",
    "https://i.imgur.com/Y6GtKc3.png", "https://i.imgur.com/vxsTh2E.png", "https://i.imgur.com/nttMAYw.png",
    "https://i.imgur.com/lkUVei7.png", "https://i.imgur.com/MENQtiW.png", "https://i.imgur.com/GXPMynI.png",
    "https://i.imgur.com/Mlj0CoI.png", "https://i.imgur.com/NmYfUe8.png", "https://i.imgur.com/Mz5cEJR.png",
    "https://i.imgur.com/IVHM0uZ.png"
];

// Resize canvas to fill window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to load all note images
async function loadNoteImages() {
    for (let url of noteUrls) {
        const img = new Image();
        img.src = url;
        await new Promise(resolve => img.onload = resolve); // Wait for each image to load
        noteImages.push(img);
    }
}

// Function to randomly place musical notes on the canvas
function placeNotes() {
    const margin = 10; // Margin from the edges
    const minDistance = 110; // Minimum distance between note centers to avoid clustering

    for (let img of noteImages) {
        let overlap, x, y;
        do {
            overlap = false;
            // Random position with margin from edges
            x = Math.random() * (canvas.width - noteSize - margin * 2) + margin;
            y = Math.random() * (canvas.height - noteSize - margin * 2) + margin;

            // Check against all already placed notes to avoid overlap
            for (let note of notes) {
                const dx = note.x - x;
                const dy = note.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    overlap = true;
                    break;
                }
            }
        } while (overlap); // Repeat if overlap is found

        const note = {
            img: img,
            x: x,
            y: y,
            revealed: false
        };
        notes.push(note);
    }
}


// Function to draw the scene
function draw() {
    // Clear the canvas
    ctx.fillStyle = 'black'; // Ensure the default state is black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each note, if it's revealed
    notes.forEach(note => {
        if (note.revealed) {
            ctx.drawImage(note.img, note.x, note.y, noteSize, noteSize);
        }
    });

    // Light up previously clicked areas and current flashlight position
    [...clickedAreas, {x: mouseX, y: mouseY, permanent: false}].forEach(area => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(area.x, area.y, flashlightSize, 0, Math.PI * 2);
        ctx.clip();
        notes.forEach(note => {
            if (area.permanent || note.revealed) {
                ctx.drawImage(note.img, note.x, note.y, noteSize, noteSize);
            }
        });
        ctx.restore();
    });

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
    clickedAreas.push({ x: clickX, y: clickY, permanent: true });

    notes.forEach(note => {
        if (
            clickX >= note.x && clickX <= note.x + noteSize &&
            clickY >= note.y && clickY <= note.y + noteSize
        ) {
            note.revealed = true;
        }
    });
}

// Initialization function
async function init() {
    await loadNoteImages();
    placeNotes();
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    draw();
}

init();

