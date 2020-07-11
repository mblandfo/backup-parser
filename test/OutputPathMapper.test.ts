import OutputPathMapper from "../src/OutputPathMapper";
import FileInfo from "../src/FileInfo";
import _ = require("lodash");

function getOutputPaths(inputPaths: string[]) {
    const outputPathMapper = new OutputPathMapper("tmp");

    const files = inputPaths.map((x) => new FileInfo(x));
    const outputPaths = files.map((x) => outputPathMapper.getOutputPath(x));

    return outputPaths;
}

test("getOutputPath one dir same paths", () => {
    const outputPaths = getOutputPaths([
        "backupOne/misc/a.txt", 
        "backupTwo/misc/a.txt",
        "backupTwo/x/misc/a.txt"
    ]);

    expect(outputPaths).toEqual([
        "tmp/misc/a.txt", 
        "tmp/misc/a2.txt",
        "tmp/misc/a3.txt"
    ]);
});

test("getOutputPath different dir same name", () => {
    const outputPaths = getOutputPaths([
        "backupOne/x/a.txt", 
        "backupTwo/y/a.txt"
    ]);

    expect(outputPaths).toEqual([
        "tmp/x/a.txt", 
        "tmp/y/a.txt"
    ]);
});

test("getOutputPath different names in root folder", () => {
    const outputPaths = getOutputPaths([
        "backupOne/a.txt", 
        "backupTwo/b.txt"
    ]);

    expect(outputPaths).toEqual([
        "tmp/backupOne/a.txt", 
        "tmp/backupTwo/b.txt"
    ]);
});
