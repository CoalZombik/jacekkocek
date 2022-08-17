import * as Main from "./main.js";

export function dateString(inputDate) {
    var minutes = inputDate.getMinutes();
    var hours = inputDate.getHours();
    var day = inputDate.getDate();
    var month = inputDate.getMonth() + 1;
    var year = inputDate.getFullYear();
    return (day + "." + month + "." + year + " " + hours + ":" + addZero(minutes));
}

export function getTimeOffset(date, timeZone) {
    const tz = date.toLocaleString("en", { timeZone, timeStyle: "long" }).split(" ").slice(-1)[0];
    const dateString = date.toString();
    let offset = Date.parse(`${dateString} ${tz}`) - Date.parse(`${dateString} UTC`);
    return offset;
}

export function toTitleCase(phrase) {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

export function timeString(seconds) {
    let output;
    if (seconds >= 3600) {
        output = Math.floor(seconds / 3600) + ":" + addZero(Math.floor((seconds % 3600) / 60)) + ":" + addZero(Math.floor(seconds % 60));
    }
    else {
        output = Math.floor(seconds / 60) + ":" + addZero(Math.floor(seconds % 60));
    }
    return output;
}

export function addZero(x) {
    return String(x).padStart(2, "0");
}

export function isValid(x){
    if(x == undefined || isNaN(x)) return false;
    else return true;
}

export async function fetchMessage(guildId,channelId,messageId){
    let guild, channel, message
    try {
        guild = await Main.client.guilds.fetch(guildId);
    } catch (error) {
        throw "Cannot fetch guild"
    }
    try {
        channel = await guild.channels.fetch(channelId);
    } catch (error) {
        throw "Cannot fetch channel"
    }
    try {
        message = await channel.messages.fetch(messageId);
    } catch (error) {
        throw "Cannot fetch message"
    }
    return message;
}
export async function testFetch(){
    return await fetchMessage("549589656606343178","76735524411331338","1006148627485446224");
}