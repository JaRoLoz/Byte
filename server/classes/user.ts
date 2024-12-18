import { Privilege, PrivilegeController } from "../controllers/privilegeController";
import { ByteGameObject } from "../shared/classes/byteObject";

export class User extends ByteGameObject {
    private src: number;

    constructor(src: number) {
        super();
        this.src = src;
    }

    public getIdentifier = (identifier: string): string | undefined =>
        //@ts-expect-error - GetPlayerIdentifierByType is not defined
        GetPlayerIdentifierByType(this.src, identifier) || undefined;

    public getIdentifiers = () => {
        //@ts-expect-error - GetNumPlayerIdentifiers is not defined
        const identifiersLength = GetNumPlayerIdentifiers(this.src);
        const identifiers: Record<string, string> = {};

        for (let i = 0; i < identifiersLength; i++) {
            //@ts-expect-error - GetPlayerIdentifier is not defined
            const identifier = GetPlayerIdentifier(this.src, i);
            const identifierName = identifier.split(":")[0];

            identifiers[identifierName] = identifier;
        }

        return identifiers;
    };

    public getPrivilege = (): Privilege => {
        if (this.src === 0) return Privilege.GOD;
        const privilegeController = PrivilegeController.getInstance();
        return privilegeController.getPrivilege(this.getIdentifier("discord")!);
    };

    public hasPrivilege = (target: Privilege) => {
        if (this.src === 0) return true; // server has maximum privilege
        const privilegeController = PrivilegeController.getInstance();
        return privilegeController.hasPrivilege(this.getPrivilege(), target);
    };

    public getSrc = () => this.src;

    public override asString(): string {
        return `User { src: ${this.src} }`;
    }

    public asJSON(): string {
        return JSON.stringify({ src: this.src });
    }
}
