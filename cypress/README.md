# Cypress end-to-ends

## Working with seed data

1.  Install `typescript-json-schema` globally

    ```
    yarn global add typescript-json-schema
    ```

2.  From the workspace root, generate an updated schema for the store

    ```
    typescript-json-schema -o data/JsonStoreSchema.json tsconfig.json JsonStore
    ```

3.  Modify the data in `data/store.json` as you wish, ensuring the following property remains.

        ```
        "$schema": "./JsonStoreSchema.json"
        ```

    VSCode should provide autocomplete and validation thanks to this schema reference.
