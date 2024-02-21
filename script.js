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

const audioUrls = [
    "https://audio.jukehost.co.uk/aOz6KfillnraJHw8E38nj0c8T4uJk3uG.mp3",  
    "https://audio.jukehost.co.uk/gVJZ29CcDLHA2eu5N2ZRthH68jtWW6Gw.mp3",
    "https://audio.jukehost.co.uk/kuI9Js3hy2kiVgojRv2yiaORL7tYYlAX.mp3",
    "https://audio.jukehost.co.uk/hkfgqlNOAxj1LgWDOBQhRTbzxq0a3xBV.mp3",
    "https://audio.jukehost.co.uk/lXCaYbwjVyRzckOilvVZxdg9MJOwy9xN.mp3",
    "https://audio.jukehost.co.uk/84b4xaUM74UJaRWCbVVeUCF822yTximk.mp3",
    "https://audio.jukehost.co.uk/e0cf53pFpqlBHa3mWIe9EFoZKNKUzjo3.mp3",
    "https://audio.jukehost.co.uk/XTKnG2oLrq1UxCHq5yHa2hp71kkaLHAY.mp3",
    "https://audio.jukehost.co.uk/xk3OfU1NDtUeRUQPlbcGmt8uNG3Hyr0m.mp3",
    "https://audio.jukehost.co.uk/hB9tnsYoYcOTi70O0oi5auIU3ZL6BEJx.mp3",
    "https://audio.jukehost.co.uk/WBe5RCJJP1vMfuaewKp1T39qm8Bm0auc.mp3",
    "https://audio.jukehost.co.uk/Zs2Ef5WCCqJswEUHc18CjbezfCl9gseq.mp3",
    "https://audio.jukehost.co.uk/26mQRqqYvPTbYVxegWXphWfYzPvlitOA.mp3",
    "https://audio.jukehost.co.uk/3rJtM3HgdQKHPj6NVcsANgc39sPIlwfR.mp3",
    "https://audio.jukehost.co.uk/vAVSRkgnD3jff7jYigFHdZlV4gxkdUfQ.mp3",
    "https://audio.jukehost.co.uk/xHRDRPYmIWURW5h4YTpgP3zZhl24NHBn.mp3",
    "https://audio.jukehost.co.uk/Pkce3RxLuRVE31dMiSiUqeSQt4FaamBB.mp3",
    "https://audio.jukehost.co.uk/2gRP6adaDph5ZaHRDaBZNhiggfhPhmGa.mp3",
    "https://audio.jukehost.co.uk/sSUTAJ1O3JYJ8nNfuV5LC55avoRySwAZ.mp3"
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
            clicks: [], // Store clicked points on this note
            audioSrc: audioUrls[index % audioUrls.length],
            audio: new Audio(audioUrls[index % audioUrls.length]),
            playing: false
        };
    
        notes.push(note);
    }
}

// Function to draw the scene
function draw() {
    // Fill the canvas with black at the start of each draw call
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each note
    notes.forEach(note => {
        // Draw the note partially based on the clicked areas and the flashlight beam
        note.clicks.forEach(click => {
            drawPartialNote(click.x, click.y, note);
        });

        // If the flashlight beam is currently over a note, draw the part of the note illuminated by the flashlight
        if (
            mouseX >= note.x && mouseX <= note.x + noteSize &&
            mouseY >= note.y && mouseY <= note.y + noteSize
        ) {
            drawPartialNote(mouseX, mouseY, note);
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

function drawPartialNote(x, y, note) {
    ctx.save(); // Save the current state of the canvas context
    ctx.beginPath();
    ctx.arc(x, y, flashlightSize, 0, Math.PI * 2); // Define a path for the flashlight beam area
    ctx.clip(); // Clip the drawing area to the flashlight beam path

    // Calculate the scale for the note image to maintain aspect ratio within the noteSize limit
    const scale = Math.min(noteSize / note.img.width, noteSize / note.img.height);
    const scaledWidth = note.img.width * scale;
    const scaledHeight = note.img.height * scale;

    // Draw the image scaled and clipped to the flashlight beam area
    ctx.drawImage(note.img, note.x, note.y, scaledWidth, scaledHeight);

    ctx.restore(); // Restore the canvas context state
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

    notes.forEach(note => {
        // Check if the click is within the bounds of this note
        if (
            clickX >= note.x && clickX <= note.x + noteSize &&
            clickY >= note.y && clickY <= note.y + noteSize
        ) {
            // For revealed notes, manage audio playback
            if (note.revealed) {
                isClickOnRevealedNote = true; // Mark that the click is on a revealed note
                
                // Toggle audio playback
                if (!note.playing) {
                    note.audio.play();
                    note.playing = true;
                } else {
                    note.audio.pause();
                    note.audio.currentTime = 0; // Reset audio to the start
                    note.playing = false;
                }
            } else {
                // If the note is not yet revealed, reveal it
                note.revealed = true;
                // Add the click point for partial reveal
                note.clicks.push({ x: clickX, y: clickY });
            }
        }
    });

    // Add a flashlight beam for clicks not on revealed notes
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
            if (note.revealed && note.audio) {
                if (!note.playing) {
                    note.audio.play();
                    note.playing = true;
                } else {
                    note.audio.pause();
                    note.playing = false;
                }
            }
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
