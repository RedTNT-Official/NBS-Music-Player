export class Layer {
    name;
    volume;
    stereo = 100;
    notes;
    constructor(name, volume, stereo = 100) {
        this.name = name;
        this.volume = volume;
        this.stereo = stereo;
        this.notes = {};
    }
}
