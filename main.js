var audioContext;
var audioSourceNode;
var analyserNode;

const fft_samples = 2048;

const fft_plot = document.getElementById("fft");
const frequency_bins = 
Plotly.newPlot(fft_plot, 
    [{

    }],
    layout);

const waveform_plot = document.getElementById("waveform"); 

window.onload = function() {
    console.log("window.onload");
    // for legacy browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    audioContext = new AudioContext();
}

// Gets the microphone
function getLocalStream() {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        audioContext.resume().then(() => {
            console.log('Playback resumed successfully');
        });
        // Create audio source node from MediaStream from microphone
        audioSourceNode = audioContext.createMediaStreamSource(stream);

        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = fft_samples;
        // Connect the audio source to the analyer for analysis
        audioSourceNode.connect(analyserNode);

        // Connect the audio source to the destination for playback
        audioSourceNode.connect(audioContext.destination);
    }).catch( err => {
        console.log("You got an error:" + err);
    });
}

function analyse() {
    const fft = new Float32Array(analyserNode.frequencyBinCount);
    analyserNode.getFloatFrequencyData(fft);
    const waveform = new Float32Array(analyserNode.fftSize)
    analyserNode.getFloatTimeDomainData(waveform);
    console.log(fft);
    console.log(waveform);
}

window.addEventListener('focus', getLocalStream);