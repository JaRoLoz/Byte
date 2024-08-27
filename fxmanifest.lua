fx_version "cerulean"
game "gta5"
author "Zurky"
description "TSTL template integrating jade"
version "1.0.0"
client_scripts {
    "lua/client/*.lua",
    "build/client_bundle.lua",
}
server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "lua/server/*.lua",
    "build/server_bundle.lua",
}
shared_scripts {
    "lua/shared/*.lua",
}
files {
    "assets/*",
}
lua54 "yes"

