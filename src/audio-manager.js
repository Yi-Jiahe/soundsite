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

    list() {
        for (var i=0; i < this.intermediateNodes.length; i++) {
            console.log(this.intermediateNodes[i]);
        }
    }

    addNode(node, index) {
        if (index === undefined) {
            index = this.intermediateNodes.length;
        }
        if (index > this.intermediateNodes.length) {
            throw 'index is invalid';
        }
        const parentNode = index == 0 ? this.sourceAnalyserNode : this.intermediateNodes[index-1];
        const childNode = index == this.intermediateNodes.length ? this.outputAnalyserNode : this.intermediateNodes[index];

        parentNode.disconnect(childNode);
        parentNode.connect(node);
        node.connect(childNode);

        this.intermediateNodes.splice(index, 0, node);
    }
}

export { AudioManager };