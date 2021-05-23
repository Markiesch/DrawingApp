const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.querySelector(".colorPicker");
const backgroundPicker = document.querySelector(".backgroundPicker");
const downloadBtn = document.querySelector(".downloadBtn");
const toolBox = document.querySelector(".toolbox");
let isDrawing = false;
let restore_array = [];
let index = -1;
let color = "white";
let mode = "pen";
let thickness;

downloadBtn.addEventListener("click", download);
function download() {
    downloadBtn.href = canvas.toDataURL();
}

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stop);
canvas.addEventListener("mouseout", stop);

function start(e) {
    closeAllTabs();
    if (e.button == 2 || e.button == 1) return;
    isDrawing = true;
    draw(e);
}

function draw({ clientX: x, clientY: y }) {
    if (!isDrawing) return;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    if (mode == "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    if (mode == "erase") {
        ctx.beginPath();
        ctx.globalCompositeOperation = "destination-out";
        ctx.arc(x, y, 1, 0, Math.PI * 2, false);
        ctx.fill();
    }
    if (mode == "ellipse") {
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
        ctx.stroke();
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

const tabs = document.querySelectorAll(".tab");

function closeAllTabs() {
    for (const tab of tabs) {
        tab.style.display = "none";
    }
}

function openTab(tab) {
    if (!tab) return;
    closeAllTabs();
    const el = document.querySelector(`.${tab}`);
    el.style.display = "block";
    el.style.left = toolBox.offsetWidth + 10 + "px";
}

const deleteBtn = document.querySelector(".trashIcon");

deleteBtn.addEventListener("click", clearCanvas);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateColor() {
    color = colorPicker.value;
}

function updateBgColor() {
    canvas.style.backgroundColor = backgroundPicker.value;
}

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key == "c") {
        openTab("colorTab");
    }
});

// ctx.font = "30px Poppins";
// ctx.fillText("Hello World", 10, 50);

function setTool() {
    mode = "erase";
}

const thicknessBtn = document.querySelector(".thickness");
thicknessBtn.addEventListener("change", updateThickness);
function updateThickness() {
    thickness = thicknessBtn.value;
}
function init() {
    resizeCanvas();
    colorPicker.value = "#ffffff";
    color = colorPicker.value;
    updateThickness();
}
init();

document.addEventListener("contextmenu", openContextMenu);

function openContextMenu(e) {
    e.preventDefault();
}

function changeBrush(brush) {
    if (!brush) return;
    mode = brush;
}
