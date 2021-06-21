function drawFFT(analyserNode, canvas, clearCanvas, options={strokeStyle: 'rgb(0, 0, 0)'}) {
    const fft = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(fft);

    var ctx = canvas.getContext('2d');

    if (clearCanvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.beginPath();
    ctx.strokeStyle = options['strokeStyle'];
    for (var i=0; i < fft.length; i++) {
        const x = Math.trunc(i);
        const y = Math.trunc((fft[i]/-255+1)*canvas.height);
        // console.log(x, y);
        if (i == 0) {
            ctx.moveTo(0, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function drawWaveform(analyserNode, canvas, clearCanvas, options={strokeStyle: 'rgb(0, 0, 0)'}){
    const waveform = new Uint8Array(analyserNode.fftSize)
    analyserNode.getByteTimeDomainData(waveform);

    var ctx = canvas.getContext('2d');

    if (clearCanvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.beginPath();
    ctx.strokeStyle = options['strokeStyle'];
    for (var i=0; i < waveform.length; i++) {
        const x = Math.trunc(i);
        const y = Math.trunc((waveform[i]/255)*canvas.height);
        // console.log(x, y);
        if (i==0) {
            ctx.moveTo(0, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

export {
    drawFFT,
    drawWaveform
}