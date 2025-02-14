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
        console.log(remoteData)
        spinner.classList.add("d-none");

        loginComponent.build(cacheToken, "private");
        loginComponent.renderForm();

        carouselComponent.build(remoteData);
        carouselComponent.render();

        tableComponent.build(["Image", "URL", "Delete"], remoteData);
        tableComponent.render();

        formComponent.render();

        pubsub.subscribe("image-deleted", async id => {
            spinner.classList.remove("d-none");

            const deleteRes= await middleware.delete(id);
            const deleteJson= await deleteRes.json();
            
            const newRemoteData= await middleware.load();
            pubsub.publish("get-remote-data", newRemoteData);
            spinner.classList.add("d-none");
        });
        pubsub.subscribe("form-submit", async formData => {
            spinner.classList.remove("d-none");
            modal.hide();
            
            const addRes=middleware.upload(formData);
            const addJson=addRes.json();
            
            const newRemoteData= await middleware.load();
            pubsub.publish("get-remote-data", newRemoteData);
            spinner.classList.add("d-none");

        });
    });
});