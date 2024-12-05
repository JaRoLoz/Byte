import { XMLParser } from "fast-xml-parser";
import { resolve } from "node:path";
import { readFileSync, writeSync, openSync } from "node:fs";

const outFile = resolve("./full-schema.sql");

const parser = new XMLParser({ ignoreAttributes: false });
const allXmlStr = readFileSync(resolve("./.idea/runConfigurations/all.xml"), "utf8");
const xml = parser.parse(allXmlStr);
const files = xml.component.configuration["script-file"]
    .map(entry => resolve(
        entry["@_value"]
            .replace("$PROJECT_DIR$", ".")
    ));

const fd = openSync(outFile, "w");
files.forEach(file => {
    const content = readFileSync(file, "utf8");
    writeSync(fd, content);
    writeSync(fd, "\n");
});
