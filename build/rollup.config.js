import terser from "@rollup/plugin-terser";

export default [
    {
        input: "./src/vision.js",
        output: {
            file: "./dist/vision.module.js",
            format: "esm"
        },
    },
    {
        input: "./src/vision.js",
        output: {
            file: "./dist/vision.module.min.js",
            format: "esm"
        },
        plugins: [
            terser()
        ]
    },
    {
        input: "./src/vision.js",
        output: {
            file: "./dist/vision.js",
            format: "umd",
            name: "vision"
        },
    },
    {
        input: "./src/vision.js",
        output: {
            file: "./dist/vision.min.js",
            format: "umd",
            name: "vision"
        },
        plugins: [
            terser()
        ]
    },
]