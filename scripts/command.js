import { NBSLoader } from "./loader";
import { command } from "./libraries/command";
import { Color } from "./libraries/util";
import config from "./configuration";
const { prefix } = config;
const PREFIX = Color.GOLD + NBSLoader.PREFIX + Color.RESET;
const USAGE = PREFIX + ` ${Color.RED}Usage: ${prefix}nbs [play | stop | volume | status]`;
command.register('nbs', 'Music player command', (player, args, out) => {
    switch (args[0]) {
        case "play":
            if (NBSLoader.checkPlaying(player))
                return out.error(PREFIX + ` ${Color.RED}Use ${prefix}nbs stop to stop playing`);
            NBSLoader.startPlaying(player);
            out.success(PREFIX + ` ${Color.GREEN}You have been connected, use ${Color.BLUE}${prefix}nbs stop ${Color.GREEN}to stop playing`);
            player.onScreenDisplay.setActionBar(`§6Now Playing: §a${NBSLoader.getCurrentSong().title}`);
            break;
        case "stop":
            if (!NBSLoader.checkPlaying(player))
                return out.error(PREFIX + ` ${Color.RED}You are not connected to the music player`);
            NBSLoader.stopPlaying(player);
            out.success(PREFIX + ` ${Color.GREEN}You are no longer connected to the music player, use ${Color.BLUE}${prefix}nbs play ${Color.GREEN}to start playing again`);
            break;
        case "status":
            let playing = NBSLoader.isActive();
            let status = playing ? Color.GREEN + "Active" : Color.RED + "Not active";
            out.success(PREFIX + ` ${Color.AQUA}Status: ` + status);
            if (playing)
                out.success(`${Color.AQUA}Current Song: ${Color.YELLOW}` + NBSLoader.getCurrentSong().title);
            out.success(`${Color.AQUA}Volume: ${Color.GREEN}` + NBSLoader.getVolume(player));
            break;
        case "volume":
            let volume = args[1];
            if (!volume || isNaN(Number(volume)))
                return out.error(PREFIX + ` ${Color.RED}Invalid number provided`);
            let playerVolume = Number(volume);
            if (playerVolume < 1 || playerVolume > 100)
                return out.error(PREFIX + ` ${Color.RED}Volume must be in a range of 1-100`);
            NBSLoader.setVolume(player, playerVolume);
            out.success(PREFIX + ` ${Color.GREEN}Volume has been set to ${Color.AQUA}` + playerVolume);
            break;
        default:
            out.error(USAGE);
            break;
    }
});
