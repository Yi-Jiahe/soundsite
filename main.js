import "./audio_graph.js";
import { drawFFT, drawWaveform } from "./drawing.js";

const fft_samples = 2048;
const frequency_bins = new Array(fft_samples/2);
for (var i=0; i < frequency_bins.length; i++) {
    frequency_bins[i] = (48000/2)/(frequency_bins.length) * i;
}
// console.log(frequency_bins);


const fft_canvas = document.getElementById("fft");
const waveform_canvas = document.getElementById("waveform"); 

window.onload = function() {
    console.log("window.onload");
    // for legacy browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    audioContext = new AudioContext();
    // console.log(audioContext.sampleRate);
}

// Gets the microphone
function getLocalStream() {
    document.body.removeEventListener('click', getLocalStream);

    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        audioContext.resume().then(() => {
            console.log('Playback resumed successfully');
        });
        // Create audio source node from MediaStream from microphone
        audioSourceNode = audioContext.createMediaStreamSource(stream);

        sourceAnalyserNode = new AnalyserNode(audioContext, {
            fftSize: fft_samples,
        });
        console.log(sourceAnalyserNode.minDecibels);
        console.log(sourceAnalyserNode.maxDecibels);
        // Connect the audio source to the source analyer for analysis
        audioSourceNode.connect(sourceAnalyserNode);
        
        var biquadFilter = new BiquadFilterNode(audioContext);
        // Connect up a biquadFilter
        sourceAnalyserNode.connect(biquadFilter);

        outputAnalyserNode = new AnalyserNode(audioContext, {
            fftSize: fft_samples,
        });
        // Connect the output to the output analyer for analysis
        biquadFilter.connect(outputAnalyserNode);

        // Connect the output to the destination for playback
        outputAnalyserNode.connect(audioContext.destination);

        window.requestAnimationFrame(draw);
    }).catch( err => {
        console.log("You got an error:" + err);
    });
}

function draw() {
    for (var analyserNode_index=0; analyserNode_index<2; analyserNode_index++){
        var analyserNode;
        var strokeStyle;
        switch(analyserNode_index) {
            case 0:
                analyserNode = sourceAnalyserNode;
                strokeStyle =  'rgb(0, 0, 0)';
                break;
            case 1:
                analyserNode = outputAnalyserNode;
                strokeStyle =  'rgb(0, 255, 0)';
                break;
        }
        
        if (analyserNode_index == 0) {
            drawFFT(analyserNode, fft_canvas, true, {'strokeStyle': strokeStyle});
            drawWaveform(analyserNode, waveform_canvas, true, {'strokeStyle': strokeStyle});
        } else {
            drawFFT(analyserNode, fft_canvas, false, {'strokeStyle': strokeStyle});
            drawWaveform(analyserNode, waveform_canvas, false, {'strokeStyle': strokeStyle});
        }
    }
    window.requestAnimationFrame(draw);
}

document.body.addEventListener('click', getLocalStream);
