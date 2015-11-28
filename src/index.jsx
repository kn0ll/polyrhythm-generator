import { Audiolet, AudioletGroup, AudioletParameter } from 'audiolet/core';
import { Sine } from 'audiolet/dsp';
import { PSeries } from 'audiolet/pattern';
import { MidiGroup } from 'audiolet-midi';

// for a formulaic explanation of polythythms,
// see https://www.youtube.com/watch?v=NOWaD8Abq90
class Generator extends MidiGroup {

  constructor(audiolet, beatsPerMeasure = 3, noteType = 4) {
    super(audiolet, 0, 1, null, 0);
    this.beatsPerMeasure = beatsPerMeasure;
    this.noteType = noteType;
  }

  // take x/n (2/3)
  // 1. create a bar with n beats (2)
  // 2. divide each beat by x (3)
  // 3. accent every n subdivided notes (2)
  play() {
    let audiolet = this.audiolet;
    let scheduler = audiolet.scheduler;
    let x = this.beatsPerMeasure;
    let n = this.noteType;

    // create a bar with n beats
    let kickBar = (() => {
      let b = [];
      for (let i = 0; i < n * x; i++) {
        b.push(i % x? 0: 1);
      }
      return b;
    })();

    scheduler.play([new PSeries(kickBar, Infinity)],  1 / x, (on) => {
      this.midiOut.send(on? 144: 128, 220, 255);
    });

    // accent every n subdivided notes
    let snareBar = (() => {
      let b = [];
      for (let i = 0; i < n * x; i++) {
        b.push(i % n? 0: 1);
      }
      return b;
    })();

    // divide each beat by x
    scheduler.play([new PSeries(snareBar, Infinity)], 1 / x, (on) => {
      this.midiOut.send(on? 144: 128, 440, 255);
    });
  }

}

let audiolet = new Audiolet();
let generator = new Generator(audiolet);
generator.play();


////////////
////////////
////////////

/*

class TestInstrument extends MidiGroup {

  constructor(audiolet) {
    super(audiolet, 1, 1, 0, null);
    this.voices = new AudioletParameter(this, null, {});
  }

  addVoice(freq) {
    let audiolet = this.audiolet;
    let voices = this.voices;
    let voices_value = voices.getValue();
    let output = this.outputs[0];

    if (!voices_value[freq]) {
      let sine = new Sine(audiolet, freq);
      voices_value[freq] = sine;
      voices.setValue(voices_value);
      sine.connect(output);
    }
  }

  removeVoice(freq) {
    let voices = this.voices;
    let voices_value = voices.getValue();
    let voice = voices_value[freq];
    let output = this.outputs[0];

    if (voice) {
      delete voices_value[freq];
      voices.setValue(voices_value);
      voice.disconnect(output);
    }
  }

  noteOn(key, vel) {
    console.log('noteOn', key);
    this.addVoice(key);
  }

  noteOff(key, vel) {
    console.log('noteOff', key);
    this.removeVoice(key);
  }

}

let testInstrument = new TestInstrument(audiolet);

generator.midiOut.connect(testInstrument);
testInstrument.connect(audiolet.output);

*/
