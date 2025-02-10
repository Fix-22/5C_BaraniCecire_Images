import { generateLoginComponent } from "./scripts/loginComponent/loginComponent.js";
import { generateNavigator } from "./scripts/navigatorComponent/navigator.js";
import { generatePubSub } from "./scripts/pubSubComponent/pubSubComponent.js";

const pubsub = generatePubSub();
const loginContainer = document.getElementById("loginContainer");

const loginComponent = generateLoginComponent(loginContainer, pubsub);

loginComponent.renderForm();

generateNavigator(pages);