var audio = {
    ctx: null,
    osc: null,
    gain: null,
    currentNote: 0,
    lastAudioUpdate: 0,
    volume: 0.0125
};


audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
audio.gain = audio.ctx.createGain();
audio.osc = audio.ctx.createOscillator();


audio.osc.type = 'square';
audio.osc.frequency.value=100;
audio.osc.connect(audio.gain);
audio.osc.start(0);

audio.gain.connect(audio.ctx.destination);