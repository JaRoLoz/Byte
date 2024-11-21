PG = {}

PG.Ready = function(cb)
    exports["Byte-pg"]:Ready(cb)
end

PG.ReadySync = function()
    local p = promise:new()

    exports["Byte-pg"]:Ready(function(err)
        p:resolve(err)
    end)

    return Citizen.Await(p)
end

PG.Query = function(query, args, cb)
    exports["Byte-pg"]:Query(query, args, cb)
end

PG.QuerySync = function(query, args)
    local p = promise:new()

    exports["Byte-pg"]:Query(query, args, function(result)
        p:resolve(result)
    end)

    return Citizen.Await(p)
end
