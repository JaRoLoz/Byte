import { CommandController } from "../controllers/commandController";
import addPrivilege from "./addPrivilege";
import closeServer from "./closeServer";
import openServer from "./openServer";
import removePrivilege from "./removePrivilege";
import testLoadPlayer from "./testLoadPlayer";
import testPlayer from "./testPlayer";

CommandController.registerCommand(addPrivilege);
CommandController.registerCommand(removePrivilege);
CommandController.registerCommand(closeServer);
CommandController.registerCommand(openServer);
CommandController.registerCommand(testPlayer);
CommandController.registerCommand(testLoadPlayer);
