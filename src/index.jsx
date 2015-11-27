import { Audiolet, AudioletGroup } from 'audiolet/core';
import { PSeries } from 'audiolet/pattern';

// for a formulaic explanation of polythythms,
// see https://www.youtube.com/watch?v=NOWaD8Abq90
class Generator extends AudioletGroup {

  constructor(audiolet, beatsPerMeasure = 3, noteType = 4) {
    super(audiolet, 0, 1);
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
      for (let i = 0; i < n; i++) {
        b.push(1);
      }
      return b;
    })();

    scheduler.play([new PSeries(kickBar, Infinity)], 1, (on) => {
      if (on) {
        // send kick
      }
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
      if (on) {
        // send snare
      }
    });
  }

}

let audiolet = new Audiolet();
let generator = new Generator(audiolet);

generator.connect(audiolet.output);
generator.play();
