import { system, world } from "@minecraft/server";
import { beforeEvents, findBestMatch } from "./util";
import config from "../configuration";
const prefix = config.prefix;
beforeEvents.chatSend.subscribe((data) => {
    try {
        if (!data.message.startsWith(prefix))
            return;
        const [cmd, ...args] = data.message.slice(prefix.length).trim().split(/ +/g);
        const command = commands.get(cmd.toLowerCase());
        const external = world.scoreboard.getObjective(`external:commands`);
        const externalList = external.getParticipants().flatMap(c => {
            if (!c.displayName.startsWith('cmd|'))
                return [];
            const CMD = JSON.parse(c.displayName.split('|')[2]);
            return commands.has(CMD.name) ? [] : CMD;
        });
        if (!command) {
            // data.sender.sendMessage(world.getDynamicPropertyIds().join('\n'))
            if (externalList.some(c => c.name === cmd.toLowerCase()))
                return;
            data.cancel = true;
            return data.sender.sendMessage(`§cNo se encuentra el comando §a${prefix}${cmd}§c. Quisiste decir §a${prefix}${findBestMatch(cmd, Array.from(commands.keys()).concat(externalList.map(c => c.name))).bestMatch.target}§c?`);
        }
        data.cancel = true;
        if (command.permissions === CommandPermissionLevel.Operator && !data.sender.isOp())
            return data.sender.sendMessage("§cComando no encontrado o no tienes permiso para utilizarlo");
        const { sender } = data;
        const result = args.join(" ").match(/([^\s"]+|"[^"]*")+/g)?.map(v => /\s/.test(v) ? v.replace(/^"|"$/g, '') : v).flatMap(e => (e.trim().length !== 0) ? e.trim() : []) || [];
        system.run(() => {
            command.cb(sender, result, new CommandOutput(sender));
        });
    }
    catch (e) {
        world.sendMessage("" + e);
    }
});
export const commands = new Map();
class CommandRegistry {
    register(name, description, cb, permissions = 0) {
        commands.set(name.toLowerCase(), {
            name: name.toLowerCase(),
            description,
            permissions,
            cb
        });
        try {
            const list = world.scoreboard.getObjective('external:commands') || world.scoreboard.addObjective('external:commands', 'external:commands');
            list.addScore(`cmd|${name.toLowerCase()}|${JSON.stringify({
                name,
                description,
                permissions
            })}`, 0);
        }
        catch (e) {
            world.sendMessage(`${e}`);
        }
    }
}
export const command = new CommandRegistry();
export var CommandPermissionLevel;
(function (CommandPermissionLevel) {
    CommandPermissionLevel[CommandPermissionLevel["Normal"] = 0] = "Normal";
    CommandPermissionLevel[CommandPermissionLevel["Operator"] = 1] = "Operator";
})(CommandPermissionLevel || (CommandPermissionLevel = {}));
export class CommandOutput {
    player;
    constructor(player) {
        this.player = player;
    }
    success(...message) {
        this.player.sendMessage('§a' + message.join(' '));
    }
    error(...message) {
        this.player.sendMessage('§c' + message.join(' '));
    }
}
