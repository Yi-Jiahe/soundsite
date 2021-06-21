var audioContext;
var audioSourceNode;
var sourceAnalyserNode;
var intermediateNodes;
var outputAnalyserNode;

function initAudioContext() {
    // for legacy browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    audioContext = new AudioContext();
}

export {
    // Variables
    audioContext, 
    audioSourceNode, 
    sourceAnalyserNode, 
    intermediateNodes,
    outputAnalyserNode,
    // Functions
    initAudioContext
};