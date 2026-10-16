let button = document.querySelector("#listen-button");

let recording = false;

function toggleRecording() {
  recording = !recording;
  console.log("Recording:", recording);
}

button?.addEventListener("click", toggleRecording);