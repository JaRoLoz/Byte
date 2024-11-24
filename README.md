<p align="center">
  <img width="460" src="https://github.com/user-attachments/assets/62a88d31-c0a9-4140-bc98-571dee3cb733">
</p>

# Byte

Byte is framework for the [Cfx.re](https://github.com/JaRoLoz/jade) plattform [FiveM](https://fivem.net/). It is written in TypeScript and transpiled to lua using a [fork](https://github.com/JaRoLoz/TypeScriptToFiveMLua) of [tstl](https://typescripttolua.github.io/). The whole framework is stiched together using the [jade](https://github.com/JaRoLoz/jade) build tool.

# Building

Once you have [jade](https://github.com/JaRoLoz/jade) installed, simply navigate to the framework's root directory and execute `jade .`. Make sure to have bun installed. By default the build in performed by [bun](https://bun.sh/), if you don't want to use bun simply replace the `package_manager` key in every build step inside the `jade.json` file with your preferred node package manager, e.g. [pnpm](https://pnpm.io/es/).

# Docs

[Client reference](https://jaroloz.github.io/Byte/client)<br>
[Server reference](https://jaroloz.github.io/Byte/server)
> [!NOTE]
> All docs for `shared` are replicated in both references.

## Dependencies

- [Byte-pg](https://github.com/JaRoLoz/Byte-pg): Minimal PostgreSQL wrapper

## Code guidelines

-   All the config files are written in the `xml` format and are stored under the `assets/` folder.
-   Some native lua modules, such as the XML parser, are stored in the `lua/` folder.
-   The type definition for the object exported by the framework to other resources can be found in `client/events/export.ts` & `server/events/export.ts`.
-   When building the framework, the exported type definitions can be found inside `build/client/byte-client.d.ts` & `build/server/byte-server.d.ts`.

### Batteries included framework

The Byte framework aims to satisfy all the needs of a developper by providing all the helper classes and utilities that one could ever need. Some of the classes included are:

-   Logger `client/utils/logger.ts` `server/utils/logger.ts`: Logger class that features different log tracing levels and module tracing.
-   EnvManager `client/utils/env.ts` `server/utils/env.ts`: Static class that provides the code with the env vars that the user defines inside the `server.cfg` config file.
-   ConfigController `shared/classes/configController.ts`: Parses the framework's `config.xml` file and provides the code with parsed values.
-   Translator `shared/classes/translator.ts`: Parses the `locales.xml` file and provides the translations for the selected language.
-   XML `shared/classes/xml.ts`: Utility class to help with the navigation of xml documents.
