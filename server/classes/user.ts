import { Privilege, PrivilegeController } from "../controllers/privilegeController";

export class User {
    private src: number;

    constructor(src: number) {
        this.src = src;
    }

    public getIdentifier = (identifier: string): string | undefined =>
        //@ts-ignore
        GetPlayerIdentifierByType(this.src, identifier) || undefined;

    public getIdentifiers = () => {
        //@ts-ignore
        const identifiersLength = GetNumPlayerIdentifiers(this.src);
        const identifiers: Record<string, string> = {};

        for (let i = 0; i < identifiersLength; i++) {
            //@ts-ignore
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
}
