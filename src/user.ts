import { ObjectId } from "mongodb";
import { DbObject } from "./dbObject";
import * as Matoshi from "./matoshi";
import { client, notifyTextChannel, operationsChannel, policyValues } from "./main";
import { getUserData } from "./sheets";
import * as Discord from "discord.js";

export class User extends DbObject {
    id: string;
    wallet?: Wallet;
    taskIds: Array<ObjectId> = [];
    streak = 0;
    lastTask = 0;

    static async get(id: string, wallet = false): Promise<User> {
        const result = (await User.dbFind({ id })) as User;

        if (result != null) {
            if (result.wallet) {
                result.wallet = await Wallet.fromData(result.wallet);
            } else if (wallet) {
                result.wallet = new Wallet();
            }
            return this.fromData(result);
        }

        const newUser = new User();
        newUser.id = id;
        if (wallet) {
            newUser.wallet = new Wallet();
        }
        User.dbSet(newUser);
        return newUser;
    }

    static override async fromData(data?: Partial<User>) {
        const newObject = (await super.fromData(data)) as User;
        Object.assign(newObject, data);
        return newObject;
    }

    static async dailyCheck() {
        const assignmentGrace = policyValues.matoshi.assignmentStreakKeep * 24 * 60 * 60 * 1000;
        const users = await User.dbFindAll<User>({});
        operationsChannel.send(`<t:${Math.floor((Date.now() - assignmentGrace - 60 * 60 * 1000 * 24) / 1000)}>`);

        for (const userData of users) {
            let user = await User.fromData(userData);
            if (user.id == client.user.id || user.id == "") continue;
            if (user.lastTask == 0) {
                user.lastTask = Date.now();
                await user.dbUpdate();
            }

            if (user.streak > 0 && user.taskIds.length == 0) {
                if (Date.now() - user.lastTask > assignmentGrace - 60 * 60 * 1000 * 24) {
                    if (Date.now() - user.lastTask > assignmentGrace) {
                        user.streak = 0;
                        operationsChannel.send(`<@${user.id}> your streak is now 0.`);
                        await user.dbUpdate();
                    } else {
                        operationsChannel.send(`<@${user.id}> you are about to loose your streak! <t:${Math.floor(user.lastTask / 1000)}>`);
                    }
                }
            }
        }
    }
}

export class Wallet extends DbObject {
    getStock(stock: string) {
        throw new Error("Method not implemented.");
    }
    setStock(stock: string, currentStock: any) {
        throw new Error("Method not implemented.");
    }
    matoshi: number = 0;
    stocks: Record<string, number> = {};
    printMatoshi() {
        console.log(this.matoshi);
    }

    static override async fromData(data: Partial<Wallet>): Promise<Wallet> {
        const newObj = (await super.fromData(data)) as Wallet;
        Object.assign(newObj, data);
        return newObj;
    }
}