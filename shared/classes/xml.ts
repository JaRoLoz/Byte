import { XMLChild, XMLNode, XMLText } from "../native_defs";

/**
 * The search parameters for the XML search
 * @param tag The tag to search for (e.g. "entry" => `<entry>...</entry>`)
 * @param attrs The attributes to search for. If not provided, it will search for all tags with the given tag.
 */
type XMLSearchParams = {
    tag: string;
    attrs?: { key: string, value: string };
}

/**
 * Class to search through a XML tree.
 * Example usage of this class can be found in {@link shared/classes/translator.Translator | Translator}.
 */
export class XMLSearchNode {
    private node: XMLChild;

    /**
     * 
     * @param node The root node from which to search from. To obtain the root node of a XML document,
     * use the global function `XML.decode(documentString)` (it is declared in `native_defs.d.ts` and implemented in `lua/shared/xml.lua`).
     */
    constructor(node: XMLChild) {
        this.node = node;
    }

    /**
     * Searches for all children nodes that match the search parameters
     * @param params The search parameters
     * @returns An array of `XMLSearchNode` objects that match the search parameters
     */
    public search = (params: XMLSearchParams): Array<XMLSearchNode> => {
        const { tag, attrs } = params;

        const children = (this.node as XMLNode).children.filter(node => !(node as XMLText).text) as Array<XMLNode>;

        let found = children.filter(child => child.tag === tag);

        if (attrs)
            found = found.filter(child => child.attrs[attrs.key] === attrs.value);
        return found.map(child => new XMLSearchNode(child));
    }

    /**
     * Returns the node as a `XMLNode`. Useful for getting the attributes of the node.
     * @returns The node as a `XMLNode`
     */
    public asNode = (): XMLNode => this.node as XMLNode;
    /**
     * @returns The inner text of the node (e.g. `<entry>text</entry> => "text"`)
     */
    public asText = (): string => ((this.node as XMLNode).children[0] as XMLText).text;
}