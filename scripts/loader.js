import { NBSPlayer } from "./player";
import { Song } from "./parser/song";
export class NBSLoader {
    static PREFIX = "[NBS]";
    static DEFAULT_VOLUME = 50;
    static songs = [];
    static volume = {};
    static players = [];
    static currentSong = 0;
    static player;
    static async init() {
        for (const song of globalThis.songs) {
            // if (this.songs.some(s => s.title === song.title)) continue;
            this.songs.push(new Song(song));
        }
        // if (!this.songs.length) return console.warn(this.PREFIX, `Could not find any song files, make sure they are located in the songs folder scripts directory.`);
        // console.warn(this.PREFIX, `Successfully loaded ${this.songs.length} songs`);
        NBSLoader.startPlayer();
        // console.warn(this.PREFIX, "NBS Music Player has been started");
    }
    static addSongFile(songFile) {
        this.songs.push(new Song(songFile));
        if (!NBSLoader.isActive())
            NBSLoader.startPlayer();
    }
    static getSongList() {
        return this.songs;
    }
    static getPreviousSong() {
        if (this.currentSong === 0) {
            this.currentSong = this.songs.length;
        }
        this.currentSong--;
        return this.songs[this.currentSong];
    }
    static getCurrentSong() {
        return this.songs[this.currentSong];
    }
    static getNextSong() {
        this.currentSong++;
        this.currentSong = this.currentSong % this.songs.length;
        return this.songs[this.currentSong];
    }
    static getRandomSong() {
        return this.songs[Math.floor(Math.random() * this.songs.length)];
    }
    static getVolume(player) {
        return this.volume[player.id] || this.DEFAULT_VOLUME;
    }
    static getSoundVolume(player) {
        return this.getVolume(player) / 100;
    }
    static setVolume(player, volume) {
        return this.volume[player.id] = volume;
    }
    static startPlaying(player) {
        this.players.push(player);
    }
    static stopPlaying(player) {
        this.players = this.players.filter(p => p.id !== player.id);
    }
    static checkPlaying(player) {
        return this.players.some(e => e === player);
    }
    static getPlayers() {
        return this.players;
    }
    static getPlayer() {
        return this.player;
    }
    static startPlayer() {
        if (this.player)
            return false;
        this.player = new NBSPlayer(this.getCurrentSong());
        return true;
    }
    static isActive() {
        if (this.player == null) {
            return false;
        }
        return this.player.isPlaying();
    }
}
