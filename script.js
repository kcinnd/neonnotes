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
let currentColorIndex = 0; // Index to cycle through flashlight colors

// URLs of the note images
const noteUrls = [
    "https://i.imgur.com/CJ09TQq.png", "https://i.imgur.com/b5fsfMv.png", "https://i.imgur.com/iAKvZfs.png",
    "https://i.imgur.com/qBMF0fz.png", "https://i.imgur.com/OGFu1Le.png", "https://i.imgur.com/iEUHvIc.png",
    "https://i.imgur.com/14w5V4V.png", "https://i.imgur.com/U0aP5pi.png", "https://i.imgur.com/ZbZ7sqd.png",
    "https://i.imgur.com/Y6GtKc3.png", "https://i.imgur.com/vxsTh2E.png", "https://i.imgur.com/nttMAYw.png",
    "https://i.imgur.com/lkUVei7.png", "https://i.imgur.com/MENQtiW.png", "https://i.imgur.com/GXPMynI.png",
    "https://i.imgur.com/Mlj0CoI.png", "https://i.imgur.com/NmYfUe8.png", "https://i.imgur.com/Mz5cEJR.png",
    "https://i.imgur.com/IVHM0uZ.png"
];

// Flashlight beam colors
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
    ['rgba(0, 255, 195, 1)', 'rgba(0, 255, 195, 0)']
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

// Function to randomly place musical notes on the canvas, ensuring no overlaps and margins
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
    // Fill the canvas with black at the start of each draw call
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each note, if it's revealed
    notes.forEach(note => {
        if (note.revealed) {
            const scale = Math.min(noteSize / note.img.width, noteSize / note.img.height);
            const scaledWidth = note.img.width * scale;
            const scaledHeight = note.img.height * scale;
            ctx.drawImage(note.img, note.x, note.y, scaledWidth, scaledHeight);
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

    // Flashlight effect following the mouse with current color
    const currentBeamColor = beamColors[currentColorIndex];
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, flashlightSize);
    gradient.addColorStop(0, currentBeamColor[0]);
    gradient.addColorStop(1, currentBeamColor[1]);
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
    let isClickOnRevealedNote = false;

    // First, check if the click is on a revealed note
    notes.forEach(note => {
        if (
            note.revealed &&
            clickX >= note.x && clickX <= note.x + noteSize &&
            clickY >= note.y && clickY <= note.y + noteSize
        ) {
            isClickOnRevealedNote = true; // The click is on a revealed note
        }
    });

    // If the click is not on a revealed note, add the clicked area for permanent lighting
    if (!isClickOnRevealedNote) {
        clickedAreas.push({ x: clickX, y: clickY, colorIndex: currentColorIndex });

        // Cycle through flashlight colors for the next click
        currentColorIndex = (currentColorIndex + 1) % beamColors.length;
    }

    // Regardless of whether the note is revealed, check if the click is within the bounds of any note
    // If so, reveal that note
    notes.forEach(note => {
        if (
            clickX >= note.x && clickX <= note.x + noteSize &&
            clickY >= note.y && clickY <= note.y + noteSize
        ) {
            note.revealed = true; // Reveal the note
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
