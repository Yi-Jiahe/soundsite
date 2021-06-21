var audioContext;
var audioSourceNode;
var sourceAnalyserNode;
var outputAnalyserNode;

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
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        audioContext.resume().then(() => {
            console.log('Playback resumed successfully');
        });
        // Create audio source node from MediaStream from microphone
        audioSourceNode = audioContext.createMediaStreamSource(stream);

        sourceAnalyserNode = audioContext.createAnalyser();
        sourceAnalyserNode.fftSize = fft_samples;
        // Connect the audio source to the source analyer for analysis
        audioSourceNode.connect(sourceAnalyserNode);
        
        var biquadFilter = audioContext.createBiquadFilter();
        // Connect up a biquadFilter
        audioSourceNode.connect(biquadFilter);

        outputAnalyserNode = audioContext.createAnalyser();
        outputAnalyserNode.fftSize = fft_samples;
        // Connect the output to the output analyer for analysis
        biquadFilter.connect(outputAnalyserNode);

        // Connect the output to the destination for playback
        biquadFilter.connect(audioContext.destination);

        window.requestAnimationFrame(analyse);
    }).catch( err => {
        console.log("You got an error:" + err);
    });
}

function analyse() {
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
        
        const fft = new Float32Array(analyserNode.frequencyBinCount);
        analyserNode.getFloatFrequencyData(fft);
        const waveform = new Float32Array(analyserNode.fftSize)
        analyserNode.getFloatTimeDomainData(waveform);
        // console.log(fft);
        // console.log(waveform);
        var ctx = fft_canvas.getContext('2d');
        if (analyserNode_index == 0) {
            ctx.clearRect(0, 0, 300, 300);
        }
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        for (var i=0; i < fft.length; i+=10) {
            const x = Math.trunc(i/10);
            const y = Math.trunc(fft[i]+300/2);
            // console.log(x, y);
            if (i == 0) {
                ctx.moveTo(0, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        ctx = waveform_canvas.getContext('2d');
        if (analyserNode_index == 0) {
            ctx.clearRect(0, 0, 300, 300);
        }
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        for (var i=0; i < waveform.length; i+=10) {
            const x = Math.trunc(i/10);
            const y = Math.trunc(waveform[i]*300+75);
            // console.log(x, y);
            if (i==0) {
                ctx.moveTo(0, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

    }

    window.requestAnimationFrame(analyse);
}

window.addEventListener('focus', getLocalStream);