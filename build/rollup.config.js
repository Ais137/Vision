export default {
    input: "./src/vision.js",
    output: [
        {
            file: "./dist/vision.module.js",
            format: "esm"
        },
        {
            file: "./dist/vision.js",
            format: "umd",
            name: "vision"
        }
    ]
}