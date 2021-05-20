const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.querySelector(".colorPicker");
const downloadBtn = document.querySelector(".downloadBtn");
let isDrawing = false;
let restore_array = [];
let index = -1;
let color = "white";
let mode = "pen";

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stop);
canvas.addEventListener("mouseout", stop);

downloadBtn.addEventListener("click", download);
function download(e) {
    downloadBtn.href = canvas.toDataURL();
}

function start(e) {
    closeAllTabs();
    isDrawing = true;
    draw(e);
}

function draw({ clientX: x, clientY: y }) {
    if (!isDrawing) return;

    if (mode == "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#171717";
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    if (mode == "erase") {
        ctx.beginPath();
        ctx.globalCompositeOperation = "destination-out";
        ctx.arc(x, y, 8, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
function stop() {
    isDrawing = false;
    ctx.beginPath();
    restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
}

function undo() {
    if (index <= 0) {
    } else {
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0);
    }
}

window.addEventListener("resize", resizeCanvas);
function resizeCanvas() {
    let height = window.innerHeight;
    let width = window.innerWidth;

    canvas.height = height;
    canvas.width = width;
    if (restore_array) {
        try {
            ctx.putImageData(restore_array[index], 0, 0);
        } catch (err) {
            console.warn(err);
        }
    }
}

function init() {
    resizeCanvas();
    colorPicker.value = "#ffffff";
    color = colorPicker.value;
}
init();

const tabs = document.querySelectorAll(".tab");

function closeAllTabs() {
    for (const tab of tabs) {
        tab.style.display = "none";
    }
}

function openTab(tab) {
    if (!tab) return;
    closeAllTabs();
    document.querySelector(`.${tab}`).style.display = "block";
}

const deleteBtn = document.querySelector(".trashIcon");

deleteBtn.addEventListener("click", clearCanvas);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateColor() {
    color = colorPicker.value;
}

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    console.log(e.key);
    if (key == "c") {
        openTab("colorTab");
    }
});

ctx.font = "30px Poppins";
ctx.fillText("Hello World", 10, 50);

function setTool() {
    mode = "erase";
}
