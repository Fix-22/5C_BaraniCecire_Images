export const generateLoginComponent = (parentElement, pubsub) => {
    let token;
    let isLogged;
    let privateClass;

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            fetch("https://ws.cipiaceinfo.it/credential/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "key": token
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(r => r.json())
            .then(data => resolve(data.result))
            .catch(err => reject(err.result));
        });
    };

    return {
        build: (inputToken, inputPrivateClass) => {
            token = inputToken;
            isLogged = sessionStorage.getItem("logged") || false;
            privateClass = inputPrivateClass;

            if (isLogged) {
                parentElement.classList.add("d-none");
                document.querySelectorAll("." + privateClass).forEach(e => {
                    e.classList.remove("d-none");
                });
            }
            else {
                parentElement.classList.remove("d-none");
                document.querySelectorAll("." + privateClass).forEach(e => {
                    e.classList.add("d-none");
                });
            }
        },
        renderForm: () => { //render della pagina admin
            const html = `
                <h1>Login</h1>
                <div class="col">
                    <input type="text" class="form-control" id="inputUsername" placeholder="Username">
                </div>
                <div class="col">
                    <input type="password" class="form-control" id="inputPassword" placeholder="Password">
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" id="loginButton"> Login</button>
                </div>
                <p id="loginResult" class="text-danger"></p> `;
            parentElement.innerHTML = html;

            document.getElementById("loginButton").onclick = () => {
                const username = document.getElementById("inputUsername").value;
                const password = document.getElementById("inputPassword").value;
                const loginResult = document.getElementById("loginResult");

                //condizioni di controllo per l'accesso
                if (username && password) {
                    login(username, password)
                    .then(r => {
                        if (r) {
                            sessionStorage.setItem("logged", true);
                            isLogged = true;
                            document.getElementById("inputUsername").value = "";
                            document.getElementById("inputUsername").value = "";

                            document.querySelectorAll("." + privateClass).forEach(e => {
                                e.classList.remove("d-none");
                            });
                            parentElement.classList.add("d-none");
                            
                            document.getElementById("inputUsername").value = "";
                            document.getElementById("inputPassword").value = "";
                        } 
                        else {
                            loginResult.innerText = "Incorrect username or password";
                            document.getElementById("inputUsername").value = "";
                            document.getElementById("inputPassword").value = "";
                        }
                    })
                    .catch(err => {
                        console.log(err) ;
                    });
                }
                else {
                    loginResult.innerText = "Not all forms compiled";
                }
            };
        },
        isLogged: () => {
            return isLogged;
        }
    };
};