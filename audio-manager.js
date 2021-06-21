class AudioManager {
    constructor(audioContext, sourceNode, sourceAnalyserNode, intermediateNodes, outputAnalyserNode){
        this.context = audioContext;
        this.sourceNode = sourceNode;
        this.sourceAnalyserNode = sourceAnalyserNode;
        this.intermediateNodes = intermediateNodes;
        this.outputAnalyserNode = outputAnalyserNode;

        this.sourceNode.connect(this.sourceAnalyserNode);
        var parentNode = this.sourceAnalyserNode;
        for (var i=0; i < this.intermediateNodes.length; i++) {
            parentNode.connect(this.intermediateNodes[i]);
            parentNode = this.intermediateNodes[i];
        }
        parentNode.connect(this.outputAnalyserNode);
        this.outputAnalyserNode.connect(this.context.destination);
    }
}

export { AudioManager };