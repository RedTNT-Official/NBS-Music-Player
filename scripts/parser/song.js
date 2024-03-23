export class Song {
    layers;
    songHeight;
    length;
    title;
    author;
    originalAuthor;
    description;
    speed;
    constructor({ speed, layers, songHeight, length, title, author, description }) {
        this.layers = layers;
        this.songHeight = songHeight;
        this.length = length;
        this.title = title;
        this.author = author;
        this.originalAuthor = author;
        this.description = description;
        this.speed = speed;
    }
    get delay() {
        return 20 / this.speed;
    }
}
