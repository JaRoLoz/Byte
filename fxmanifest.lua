fx_version "cerulean"
game "gta5"
author "Zurky"
description "Batteries included framework for the Cfx.re platform."
version "0.3.3"
client_scripts {
    "lua/client/*.lua",
    "build/client_bundle.lua",
}
server_scripts {
    "lua/server/*.lua",
    "build/server_bundle.lua",
}
shared_scripts {
    "lua/shared/*.lua",
}
files {
    "assets/*",
}
dependencies {
    "Byte-pg",
}
lua54 "yes"

