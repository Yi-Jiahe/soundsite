import {
    AudioManager
} from "./audio-manager.js";
import {
    drawFFT,
    drawWaveform
} from "./drawing.js";
import {
    AudioGraph
} from "./audio_graph.js"

let audioManager;

const fft_samples = 2048;
// const frequency_bins = new Array(fft_samples / 2);
// for (var i = 0; i < frequency_bins.length; i++) {
//     frequency_bins[i] = (48000 / 2) / (frequency_bins.length) * i;
// }
// console.log(frequency_bins);

const fft_canvas = document.getElementById("fft");
const waveform_canvas = document.getElementById("waveform");

function init() {
    document.body.removeEventListener('click', init);

    // for legacy browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();

    // Get the microphone
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    }).then(stream => {
        audioContext.resume().then(() => {
            console.log('Playback resumed successfully');
        });
        // Create audio source node from MediaStream from microphone
        const audioSourceNode = audioContext.createMediaStreamSource(stream);

        const sourceAnalyserNode = new AnalyserNode(audioContext, {
            fftSize: fft_samples,
        });

        const biquadFilter0 = new BiquadFilterNode(audioContext);
        const waveShaperNode = new WaveShaperNode(audioContext);

        const outputAnalyserNode = new AnalyserNode(audioContext, {
            fftSize: fft_samples,
        });

        audioManager = new AudioManager(
            audioContext,
            audioSourceNode, 
            sourceAnalyserNode,
            [
                biquadFilter0, 
                waveShaperNode                
            ], 
            outputAnalyserNode);
        audioManager.list();

        const dynamicsCompressorNode = new DynamicsCompressorNode(audioContext);
        audioManager.addNode(dynamicsCompressorNode);
        audioManager.list();
        
        const domContainer = document.querySelector('#audio_graph');
        ReactDOM.render(React.createElement(AudioGraph, 
            { audioManager: audioManager }), domContainer);

        window.requestAnimationFrame(draw);
    }).catch(err => {
        console.log("You got an error:" + err);
    });
}

function draw() {
    for (var analyserNode_index = 0; analyserNode_index < 2; analyserNode_index++) {
        var analyserNode;
        var strokeStyle;
        switch (analyserNode_index) {
            case 0:
                analyserNode = audioManager.sourceAnalyserNode;
                strokeStyle = 'rgb(0, 0, 0)';
                break;
            case 1:
                analyserNode = audioManager.outputAnalyserNode;
                strokeStyle = 'rgb(0, 255, 0)';
                break;
        }

        if (analyserNode_index == 0) {
            drawFFT(analyserNode, fft_canvas, true, {
                'strokeStyle': strokeStyle
            });
            drawWaveform(analyserNode, waveform_canvas, true, {
                'strokeStyle': strokeStyle
            });
        } else {
            drawFFT(analyserNode, fft_canvas, false, {
                'strokeStyle': strokeStyle
            });
            drawWaveform(analyserNode, waveform_canvas, false, {
                'strokeStyle': strokeStyle
            });
        }
    }

    window.requestAnimationFrame(draw);
}

document.body.addEventListener('click', init);