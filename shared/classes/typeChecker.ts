export type SimpleCheckedType = 
    | "string"
    | "string?"
    | "string[]"
    | "string[]?"
    | "number"
    | "number?"
    | "number[]"
    | "number[]?"
    | "boolean"
    | "boolean?"
    | "boolean[]"
    | "boolean[]?"
    | "null"
    | "null[]"
    | "null[]?"
    | "undefined"
    | "undefined[]"
    | "undefined[]?";

export interface ComplexCheckedType {
    [key: string]: SimpleCheckedType | ComplexCheckedType;
};

export type CheckedType = SimpleCheckedType | ComplexCheckedType;

/** 
 * TypeChecker class. Given a prototype, it checks if an object matches it.
 * WIP: It doesn't check for extra keys in the object, nor it supports optional keys or arrays of objects.
*/
export class TypeChecker {
    private prototype: CheckedType;

    constructor(prototype: CheckedType) {
        this.prototype = prototype;
    }

    public check = (object: any): boolean => TypeChecker.checkR(object, this.prototype);

    /** @noSelf **/
    private static checkR = (object: any, expected: CheckedType): boolean => {
        const objectType = typeof object;
        const expectedType = typeof expected;
        if (expectedType === "object") {
            if (objectType !== "object" || TypeChecker.isObjectAnArray(object))
                return false;

            return !Object.keys(expected).some(key => !TypeChecker.checkR(object[key], (expected as Record<string, CheckedType>)[key]));
        } else if ((expected as SimpleCheckedType).endsWith("[]")) {
            if (objectType !== "object" || !TypeChecker.isObjectAnArray(object))
                return false;

            const arrayType = (expected as SimpleCheckedType).slice(0, -2) as SimpleCheckedType;
            return !Object.values(object).some(value => !TypeChecker.checkR(value, arrayType));
        }
        if ((expected as SimpleCheckedType).endsWith("?")) return true;
        return objectType === expected;
    };

    /** @noSelf **/
    private static isObjectAnArray = (object: any): boolean => {
        const hasStringKeys = Object.keys(object).some(key => typeof key === "string");
        return !hasStringKeys;
    }
};
