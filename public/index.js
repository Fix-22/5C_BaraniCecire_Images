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
const formContainer = document.getElementById("modalBody");
const formComponent = generateFormComponent(formContainer, pubsub);

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

        formComponent.render();

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

        pubsub.subscribe("form-submit", formData => {
            spinner.classList.remove("d-none");
            
            fetch("/add", {
                method: "POST",
                body: formData
            }).then(r => r.json())
            .then(data => {
                spinner.classList.add("d-none");
                pubsub.publish("get-remote-data");
            });
        });
    });
});