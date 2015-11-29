import { PSeries } from 'audiolet/pattern';
import { MidiGroup } from 'audiolet-midi';

// TODO: at the moment, this only generates a "kick" and "snare" bar,
// denotated by MIDI values 0 and 1 respectively. this is not appropriate for
// a final implementation but works fine for tests.

// for a formulaic explanation of polythythms,
// see https://www.youtube.com/watch?v=NOWaD8Abq90
class PolyrhythmGenerator extends MidiGroup {

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
      this.midiOut.send(on? 144: 128, 0, 255);
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
      this.midiOut.send(on? 144: 128, 1, 255);
    });
  }

}

export default { PolyrhythmGenerator };
