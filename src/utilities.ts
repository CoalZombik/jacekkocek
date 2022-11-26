import { Channel, Guild, Message, TextBasedChannel, TextChannel, ThreadChannel, NewsChannel, ButtonBuilder, ActionRowBuilder, ButtonComponent } from "discord.js";
import * as Main from "./main";

export function dateString(inputDate: Date) {
    let minutes = inputDate.getMinutes();
    let hours = inputDate.getHours();
    let day = inputDate.getDate();
    let month = inputDate.getMonth() + 1;
    let year = inputDate.getFullYear();
    return (day + "." + month + "." + year + " " + hours + ":" + addZero(minutes));
}

export function simpleDateString(inputDate: Date) {
    let day = inputDate.getDate();
    let month = inputDate.getMonth() + 1;
    return (day + "." + month + ".");
}

export function getTimeOffset(date: Date, timeZone: string) {
    const tz = date.toLocaleString("en", { timeZone, timeStyle: "long" }).split(" ").slice(-1)[0];
    const dateString = date.toString();
    let offset = Date.parse(`${dateString} ${tz}`) - Date.parse(`${dateString} UTC`);
    return offset;
}
/**
 * @param {String} phrase
 */
export function toTitleCase(phrase: string) {
    return phrase
        .toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export function randomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

export function timeString(seconds: number) {
    let output: string;
    if (seconds >= 3600) {
        output = Math.floor(seconds / 3600) + ":" + addZero(Math.floor((seconds % 3600) / 60)) + ":" + addZero(Math.floor(seconds % 60));
    }
    else {
        output = Math.floor(seconds / 60) + ":" + addZero(Math.floor(seconds % 60));
    }
    return output;
}

export function addZero(x: number) {
    return String(x).padStart(2, "0");
}

export function isValid(x: number) {
    if (x == undefined || isNaN(x)) return false;
    else return true;
}

export async function fetchMessage(channelId: string, messageId: any): Promise<Message> {
    try {
        let channel = await Main.client.channels.fetch(channelId) as TextBasedChannel;
        return await channel.messages.fetch({ message: messageId, cache: true });
    } catch (error) {
        return undefined;
        //throw new Error("Cannot fetch message");
    }
}
export function matchMessages(a: Message, b: Message) {
    return a.id == b.id && a.channelId == b.channelId
}

export function isActualChannel(channel: any): channel is TextChannel | ThreadChannel | NewsChannel {
    return (channel instanceof TextChannel || channel instanceof ThreadChannel || channel instanceof NewsChannel);
}

export function dateFromKinoString(text: string): Date {
    try {
        let day = parseInt(text.split('.')[0]);
        let month = parseInt(text.split('.')[1]);
        let now = new Date();

        if (!(day <= 31 && day > 0 && month > 0 && month <= 12)) throw new Error("Invalid date: " + text);

        let yearOffset = 0;

        if (month < now.getMonth() + 1) yearOffset++;

        let output = new Date();
        output.setFullYear(now.getFullYear() + yearOffset, month - 1, day);
        return output;
    } catch (error) {
        return undefined;
    }

}

export function weekdayEmoji(day) {
    switch (day) {
        case 1: return "<:po:767907091469828106>";
        case 2: return "<:ut:767907090709872661>";
        case 3: return "<:st:767907091125895178>";
        case 4: return "<:ct:767907091880476732>";
        case 5: return "<:pa:767907093205614622>";
        case 6: return "<:so:767907093222916126>";
        case 0: return "<:ne:767907093352153118>";
    }
}

export function messageError(channel: TextBasedChannel, error: Error) {
    console.error(error);
    channel.send(error.name + ": " + error.message);
}

export async function disableMessageButtons(msg: Message, setDisabled = true) {
    let comp = msg.components;
    let newActionRow = new ActionRowBuilder<ButtonBuilder>();
    for (const component of comp[0].components) {
        if (component instanceof ButtonComponent)
            newActionRow.addComponents(new ButtonBuilder(component).setDisabled(setDisabled));
        else
            throw new Error("Expected only ButtonComponent");
    }
    msg.edit({ content: msg.content, embeds: msg.embeds, components: [newActionRow] })
}