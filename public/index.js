import { generateNavigator } from "./scripts/navigatorComponent/navigatorComponent.js";
import { generatePubSub } from "./scripts/pubSubComponent/pubSubComponent.js";
import { generateLoginComponent } from "./scripts/loginComponent/loginComponent.js";
import { generateCarouselComponent } from "./scripts/carouselComponent/carouselComponent.js";

generateNavigator(pages);

const pubsub = generatePubSub();
const loginContainer = document.getElementById("loginContainer");
const loginComponent = generateLoginComponent(loginContainer, pubsub);
const carouselContainer = document.getElementById("carouselBody");
const carouselComponent = generateCarouselComponent(carouselContainer);

fetch("conf.json").then(d => d.json()).then(json => {
    const cacheToken = json.cacheToken;

    fetch("/get").then(r => r.json()).then(data => {
        console.log(data.images)
        carouselComponent.build(data.images);
        carouselComponent.render();
    });

    loginComponent.build(cacheToken, "private");
    loginComponent.renderForm();
});