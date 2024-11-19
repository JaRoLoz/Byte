import { User } from "../classes/user";
import { Privilege } from "./privilegeController";

export type Command = {
    command: string;
    commandFn: (this: void, src: number, args: string[], raw: string) => void;
    privilege?: Privilege;
};

/** @noSelf **/
export class CommandController {
    public static registerCommand = (command: Command) => {
        RegisterCommand(
            command.command,
            (src: number, args: string[], raw: string) => {
                const requiredPrivilege = command.privilege || Privilege.NONE;
                const user = new User(src);
                const hasPrivilege = user.hasPrivilege(requiredPrivilege);
                if (!hasPrivilege) return;

                command.commandFn(src, args, raw);
            },
            false
        );
    };
}
