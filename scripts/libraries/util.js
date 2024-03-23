import { Instrument } from "../parser/instrument";
import { world } from "@minecraft/server";
export const afterEvents = world.afterEvents;
export const beforeEvents = world.beforeEvents;
function compareTwoStrings(first, second) {
    first = first.replace(/\s+/g, '');
    second = second.replace(/\s+/g, '');
    if (first === second)
        return 1; // identical or empty
    if (first.length < 2 || second.length < 2)
        return 0; // if either is a 0-letter or 1-letter string
    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        const count = firstBigrams.has(bigram)
            ? firstBigrams.get(bigram) + 1
            : 1;
        firstBigrams.set(bigram, count);
    }
    ;
    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        const count = firstBigrams.has(bigram)
            ? firstBigrams.get(bigram)
            : 0;
        if (count > 0) {
            firstBigrams.set(bigram, count - 1);
            intersectionSize++;
        }
    }
    return (2.0 * intersectionSize) / (first.length + second.length - 2);
}
function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== 'string')
        return false;
    if (!Array.isArray(targetStrings))
        return false;
    if (!targetStrings.length)
        return false;
    if (targetStrings.find((s) => {
        return typeof s !== 'string';
    }))
        return false;
    return true;
}
export function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings))
        throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
    const ratings = [];
    let bestMatchIndex = 0;
    for (let i = 0; i < targetStrings.length; i++) {
        const currentTargetString = targetStrings[i];
        const currentRating = compareTwoStrings(mainString, currentTargetString);
        ratings.push({ target: currentTargetString, rating: currentRating });
        if (currentRating > ratings[bestMatchIndex].rating) {
            bestMatchIndex = i;
        }
    }
    const bestMatch = ratings[bestMatchIndex];
    return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex };
}
export class Utils {
    static INSTRUMENT_MAP = {
        [Instrument.PIANO]: "note.harp",
        [Instrument.DOUBLE_BASS]: "note.bass",
        [Instrument.BASS_DRUM]: "note.bd",
        [Instrument.SNARE]: "note.snare",
        [Instrument.CLICK]: "note.hat",
        [Instrument.GUITAR]: "note.guitar",
        [Instrument.FLUTE]: "note.flute",
        [Instrument.BELL]: "note.bell",
        [Instrument.CHIME]: "note.chime",
        [Instrument.XYLOPHONE]: "note.xylophone",
        [Instrument.IRONXYLOPHONE]: "note.iron_xylophone",
        [Instrument.COWBELL]: "note.cow_bell",
        [Instrument.DIDGERIDOO]: "note.didgeridoo",
        [Instrument.BIT]: "note.bit",
        [Instrument.BANJO]: "note.banjo",
        [Instrument.PLING]: "note.pling"
    };
}
export var Color;
(function (Color) {
    Color["BLACK"] = "\u00A70";
    Color["DARK_BLUE"] = "\u00A71";
    Color["DARK_GREEN"] = "\u00A72";
    Color["DARK_AQUA"] = "\u00A73";
    Color["DARK_RED"] = "\u00A74";
    Color["DARK_PURPLE"] = "\u00A75";
    Color["GOLD"] = "\u00A76";
    Color["GRAY"] = "\u00A77";
    Color["DARK_GRAY"] = "\u00A78";
    Color["BLUE"] = "\u00A79";
    Color["GREEN"] = "\u00A7a";
    Color["AQUA"] = "\u00A7b";
    Color["RED"] = "\u00A7c";
    Color["LIGHT_PURPLE"] = "\u00A7d";
    Color["YELLOW"] = "\u00A7e";
    Color["WHITE"] = "\u00A7f";
    Color["MC_GOLD"] = "\u00A7g";
    Color["OBFUSCATED"] = "\u00A7k";
    Color["BOLD"] = "\u00A7l";
    Color["ITALIC"] = "\u00A7o";
    Color["RESET"] = "\u00A7r";
})(Color || (Color = {}));
