import { generateNavigator } from "./scripts/navigatorComponent/navigatorComponent.js";
import { generatePubSub } from "./scripts/pubSubComponent/pubSubComponent.js";
import { generateLoginComponent } from "./scripts/loginComponent/loginComponent.js";
import { generateCarouselComponent } from "./scripts/carouselComponent/carouselComponent.js";
import { generateTableComponent } from "./scripts/tableComponent/tableComponent.js";
import { generateFormComponent } from "./scripts/formComponent/formComponent.js";
import { generateMiddleware } from "./scripts/middlewareComponent/middlewareComponent.js";

generateNavigator(pages);

const pubsub = generatePubSub();
const middleware=generateMiddleware();
const carouselContainer = document.getElementById("carouselBody");
const carouselComponent = generateCarouselComponent(carouselContainer, pubsub);
const loginContainer = document.getElementById("loginContainer");
const loginComponent = generateLoginComponent(loginContainer, pubsub);
const tableContainer = document.getElementById("tableContainer");
const tableComponent = generateTableComponent(tableContainer, pubsub);
const formContainer = document.getElementById("modalBody");
const formComponent = generateFormComponent(formContainer, pubsub);

const spinner = document.getElementById("spinner");

const modal = new bootstrap.Modal("#modalForm");
fetch("conf.json").then(r => r.json()).then(data => {
    const cacheToken = data.cacheToken;

    middleware.load().then(remoteData => {
        spinner.classList.add("d-none");

        loginComponent.build(cacheToken, "private");
        loginComponent.renderForm();

        carouselComponent.build(remoteData);
        carouselComponent.render();

        tableComponent.build(["Image", "URL", "Delete"], remoteData);
        tableComponent.render();

        formComponent.render();

        pubsub.subscribe("image-deleted", id => {
            spinner.classList.remove("d-none");

            middleware.delete(id).then(data => {
                middleware.load().then(newRemoteData => {
                    pubsub.publish("get-remote-data", newRemoteData);
                    spinner.classList.add("d-none");
                });
            });
        });
        pubsub.subscribe("form-submit", formData => {
            spinner.classList.remove("d-none");
            modal.hide();
            
            middleware.upload(formData).then(data => {
                middleware.load().then(newRemoteData => {
                    pubsub.publish("get-remote-data", newRemoteData);
                    spinner.classList.add("d-none");
                });
            });
        });
    });
});