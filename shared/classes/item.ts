export class Item {
    private name: string;
    private label: string;
    private description: string;
    private weight: number;
    private unique: boolean;

    constructor(name: string, label: string, description: string, weight: number, unique: boolean) {
        this.name = name;
        this.label = label;
        this.description = description;
        this.weight = weight;
        this.unique = unique;
    }

    public getName = () => this.name;
    public getLabel = () => this.label;
    public getDescription = () => this.description;
    public getWeight = () => this.weight;
    public getUnique = () => this.unique;

    public asString = () => `Item { name: ${this.name}, label: ${this.label}, description: ${this.description}, weight: ${this.weight}, unique: ${this.unique} }`;
}