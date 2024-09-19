module.exports = {
    parserOptions: {
        project: ["./tsconfig.json"],
    },
    plugins: ["@hboictcloud"],
    extends: ["plugin:@typescript-eslint/recommended-type-checked", "plugin:@hboictcloud/base"],
    rules: {
        //NOTE: Indentation warnings are a little weird from time to time, so disable them to prevent confusion.
        indent: "off",
        //NOTE: This is for the instanceOf function
        "@typescript-eslint/unbound-method": "off",
        //BUG: @models is treated as any by web
        "@typescript-eslint/no-redundant-type-constituents": "off",
        //Allow unused vars in arguments when they are prefixed with an underscore
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
            },
        ],
        //Allow use of any in multiple contexts
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
