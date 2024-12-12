import { CommandController } from "../controllers/commandController";
import addPrivilege from "./addPrivilege";
import closeServer from "./closeServer";
import openServer from "./openServer";
import removePrivilege from "./removePrivilege";
import testLoadPlayer from "./testLoadPlayer";

const commands = [addPrivilege, removePrivilege, closeServer, openServer, testLoadPlayer];

commands.forEach(command => CommandController.registerCommand(command));
