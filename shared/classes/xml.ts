import { XMLChild, XMLNode, XMLText } from "../native_defs";

type XMLSearchParams = {
    tag: string;
    attrs?: { key: string, value: string };
}

export class XMLSearchNode {
    /** @noSelf **/
    public static construct = (node: XMLChild) => new XMLSearchNode(node);

    private node: XMLChild;
    constructor(node: XMLChild) {
        this.node = node;
    }

    public search = (params: XMLSearchParams): Array<XMLSearchNode> => {
        const { tag, attrs } = params;

        const children = (this.node as XMLNode).children.filter(node => !(node as XMLText).text) as Array<XMLNode>;

        let found = children.filter(child => child.tag === tag);

        if (attrs)
            found = found.filter(child => child.attrs[attrs.key] === attrs.value);
        return found.map(child => new XMLSearchNode(child));
    }

    public asNode = (): XMLNode => this.node as XMLNode;
    public asText = (): string => ((this.node as XMLNode).children[0] as XMLText).text;
}