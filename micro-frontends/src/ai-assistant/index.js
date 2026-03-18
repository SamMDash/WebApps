import { React2AngularBridgeBuilder } from "../utils/bridge-builder";
import AIClinicalAssistant from "../../../../ai-integration/frontend-next/app/AIClinicalAssistant";

const MODULE_NAME = "bahmni.mfe.aiAssistant";
angular.module(MODULE_NAME, []);

const builder = new React2AngularBridgeBuilder({
  moduleName: MODULE_NAME,
  componentPrefix: "mfeAIAssistant",
});

builder.createComponentWithTranslationForwarding(
  "AIClinicalAssistant",
  AIClinicalAssistant
);

export default MODULE_NAME;
