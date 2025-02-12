import { generateNavigator } from "./scripts/navigatorComponent/navigatorComponent.js";
import { generatePubSub } from "./scripts/pubSubComponent/pubSubComponent.js";
import { generateLoginComponent } from "./scripts/loginComponent/loginComponent.js";
import { generateCarouselComponent } from "./scripts/carouselComponent/carouselComponent.js";
import { generateTableComponent } from "./scripts/tableComponent/tableComponent.js";
import { generateFormComponent } from "./scripts/formComponent/formComponent.js";

generateNavigator(pages);

const pubsub = generatePubSub();
const carouselContainer = document.getElementById("carouselBody");
const carouselComponent = generateCarouselComponent(carouselContainer);
const loginContainer = document.getElementById("loginContainer");
const loginComponent = generateLoginComponent(loginContainer, pubsub);
const tableContainer = document.getElementById("tableContainer");
const tableComponent = generateTableComponent(tableContainer, pubsub);
const formContainer = document.getElementById("formContainer");
const formComponent = generateForm(formContainer, pubsub);
43er

const spinner = document.getElementById("spinner");

fetch("conf.json").then(d => d.json()).then(json => {
    const cacheToken = json.cacheToken;

    fetch("/get").then(r => r.json()).then(data => {
        spinner.classList.add("d-none");

        loginComponent.build(cacheToken, "private");
        loginComponent.renderForm();

        carouselComponent.build(data.images);
        carouselComponent.render();

        tableComponent.build(["Image", "URL", "Delete"], data.images);
        tableComponent.render();

        pubsub.subscribe("image-deleted", id => {
            spinner.classList.remove("d-none");

            fetch("/delete/" + id, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(r => r.json())
            .then(d => {
                spinner.classList.add("d-none");
                tableComponent.render();
            });
        });
    });
});