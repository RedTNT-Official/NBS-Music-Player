import { afterEvents, beforeEvents } from "./libraries/util";
import { NBSLoader } from "./loader";
import { system } from "@minecraft/server";
import "./command";
beforeEvents.playerLeave.subscribe(({ player }) => {
    NBSLoader.stopPlaying(player);
});
afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!NBSLoader.isActive())
        NBSLoader.init();
    if (initialSpawn)
        NBSLoader.startPlaying(player);
});
system.runTimeout(() => { NBSLoader.init(); }, 40);
system.afterEvents.scriptEventReceive.subscribe(({ message, id }) => {
    const args = message.toLowerCase().split(/ +/g);
    if (id.toLowerCase() !== 'redtnt:music')
        return;
    switch (args[0].toLowerCase()) {
        case 'random':
            NBSLoader.player.setSong(NBSLoader.getRandomSong());
            break;
        case 'next':
            NBSLoader.player.setSong(NBSLoader.getNextSong());
            break;
        case 'previous':
            NBSLoader.player.setSong(NBSLoader.getPreviousSong() || NBSLoader.songs[NBSLoader.songs.length - 1]);
            break;
        default:
            return;
    }
    NBSLoader.player.tick = -1;
    NBSLoader.player.delayTick = 0;
});
