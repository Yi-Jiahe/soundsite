import Plotly from 'plotly.js-dist';

var audioContext;
var audioSourceNode;
var analyserNode;

const fft_samples = 2048;

const fft_plot = document.getElementById("fft");
const frequency_bins = new Array(fft_samples/2);
for (var i=0; i < frequency_bins.length; i++) {
    frequency_bins[i] = 48000/(frequency_bins.length) * i;
}
// console.log(frequency_bins);
Plotly.newPlot(fft_plot, 
    [{
        x: frequency_bins,
        y: new Float32Array(frequency_bins.length),
        type: 'bar'
    }]);

const waveform_plot = document.getElementById("waveform"); 

window.onload = function() {
    console.log("window.onload");
    // for legacy browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    audioContext = new AudioContext();
    // console.log(audioContext.sampleRate);
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

        setInterval(analyse, 500);
    }).catch( err => {
        console.log("You got an error:" + err);
    });
}

function analyse() {
    const fft = new Float32Array(analyserNode.frequencyBinCount);
    analyserNode.getFloatFrequencyData(fft);
    const waveform = new Float32Array(analyserNode.fftSize)
    analyserNode.getFloatTimeDomainData(waveform);
    // console.log(fft);
    Plotly.animate(fft_plot,
        { 
            data: [{
                y: fft,
            }]
        }
    );
    // console.log(waveform);
}

window.addEventListener('focus', getLocalStream);