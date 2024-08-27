export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .split("")
        .map(c => {
            if (c === "x") return Math.floor(Math.random() * 0xf).toString(16); // [0-9a-f]
            if (c === "y") return Math.floor(Math.random() * 4 + 8).toString(16); // [89ab]
            return c;
        })
        .join("");
};
