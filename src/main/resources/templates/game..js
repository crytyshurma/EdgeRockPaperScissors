let video = document.getElementById("camera");
let canvas = document.getElementById("snapshot");
let ctx = canvas.getContext("2d");
let countdownEl = document.getElementById("countdown");
let mode = "1player";

function selectMode(selected) {
    mode = selected;
    alert("Mode selected: " + mode);
}

async function startCamera() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

async function startGame() {
    let counter = 3;
    countdownEl.textContent = counter;
    let countdown = setInterval(() => {
        counter--;
        countdownEl.textContent = counter;
        if (counter === 0) {
            clearInterval(countdown);
            countdownEl.textContent = "Shoot!";
            takePicture();
        }
    }, 1000);
}

function takePicture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(sendToServer, "image/jpeg");
}

function sendToServer(blob) {
    let formData = new FormData();
    formData.append("image", blob, "capture.jpg");
    formData.append("mode", mode);

    fetch("/play", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            document.getElementById("player1").textContent = "Player 1: " + data.prediction;
            if (mode === "1player") {
                const computer = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
                document.getElementById("player2").textContent = "Computer: " + computer;
                decideWinner(data.prediction, computer);
            }
        });
}

function decideWinner(p1, p2) {
    if (p1 === p2) {
        document.getElementById("winner").textContent = "Draw!";
    } else if (
        (p1 === "rock" && p2 === "scissors") ||
        (p1 === "scissors" && p2 === "paper") ||
        (p1 === "paper" && p2 === "rock")
    ) {
        document.getElementById("winner").textContent = "Player 1 Wins!";
    } else {
        document.getElementById("winner").textContent = "Player 2 Wins!";
    }
}

startCamera();
