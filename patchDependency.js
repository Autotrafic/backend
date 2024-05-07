const fs = require("fs");
const path = require("path");

const filePath = path.resolve(
    __dirname,
    "./node_modules/ipdata/lib/ipdata.d.ts"
);

fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading ipdata package file:", err);
        return;
    }

    const modifiedContent = data.replace(
        "LRU<string, LookupResponse>;",
        "string | LookupResponse;"
    );

    fs.writeFile(filePath, modifiedContent, "utf8", (err) => {
        if (err) {
            console.error("Error writing ipdata package file:", err);
            return;
        }
        console.log("ipdata package patched successfully.");
    });
});
