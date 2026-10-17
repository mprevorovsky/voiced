const button = document.querySelector<HTMLButtonElement>('#listen-button')
const output = document.querySelector<HTMLDivElement>('#listen-output')

let isListening = false
let audioContext: AudioContext = new AudioContext()
let stream: MediaStream | null = null
let animationFrameId: number | null = null

async function toggleListening(): Promise<void> {
    isListening = !isListening
    button?.classList.toggle('listening', isListening)
    isListening ? startListening() : stopListening()
}

async function startListening() {
    button!.textContent = 'foukni'

    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    source.connect(analyser)

    animationFrameId = updateVisuals(analyser)
}

function stopListening() {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop())
    }
    stream = null
    
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
    
    button!.textContent = 'klikni'
    output!.style.transform = 'translate(-50%, -50%) scale(0)'
}

function updateVisuals(analyser: AnalyserNode): number {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)

    const outputValue = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
    output!.style.transform = `translate(-50%, -50%) scale(${outputValue})`

    return requestAnimationFrame(() => updateVisuals(analyser))
}

;(function init() {
    button?.addEventListener('click', toggleListening)
})()
