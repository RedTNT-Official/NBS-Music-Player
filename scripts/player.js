import { system } from "@minecraft/server";
import { Instrument } from "./parser/instrument";
import { NBSLoader } from "./loader";
import { Utils } from "./libraries/util";
import config from "./configuration";
const { order } = config;
export class NBSPlayer {
    song;
    playing = false;
    tick = -1;
    updateTick = 0;
    delayTick = 0;
    constructor(song) {
        this.setSong(song);
        this.playing = true;
        this.start();
    }
    start() {
        system.runInterval(() => {
            if (!this.playing)
                return;
            if (this.tick > this.song.length) {
                this.delayTick++;
                if (this.delayTick % 60 == 0) {
                    this.tick = -1;
                    this.delayTick = 0;
                    this.setSong(order === 'normal' ? NBSLoader.getNextSong() : NBSLoader.getRandomSong());
                }
            }
            const delay = this.song.delay;
            this.updateTick++;
            if (!Math.floor(this.updateTick % delay)) {
                this.tick++;
                for (const player of NBSLoader.getPlayers()) {
                    this.playTick(player);
                }
            }
        }, 1);
    }
    playTick(player) {
        if (!player.isValid())
            return NBSLoader.stopPlaying(player);
        for (const layer of this.song.layers) {
            if (!layer)
                continue;
            let note = layer.notes[this.tick];
            if (!note)
                continue;
            let volume = ((layer.volume * NBSLoader.getVolume(player)) / 10000);
            let pitch = 2 ** ((note.key - 45) / 12);
            let sound = Utils.INSTRUMENT_MAP[note.instrument] ?? Utils.INSTRUMENT_MAP[Instrument.PIANO];
            player.playSound(sound, {
                pitch,
                volume
            });
            note = undefined;
        }
    }
    setSong(song) {
        this.song = song;
        NBSLoader.getPlayers().forEach((player) => {
            player.onScreenDisplay.setActionBar(`§6Now Playing: §a${song.title}`);
        });
    }
    getSong() {
        return this.song;
    }
    setPlaying(playing) {
        this.playing = playing;
    }
    isPlaying() {
        return this.playing;
    }
}
