export const generateTableComponent = (parentElement,pubsub) => {
    let header = [];
    let data = [];

    const tableObject = { //build della tabella nella pagina admin
        build: function(inputHeader, inputData) {
            header = inputHeader;
            data = inputData;
            pubsub.subscribe("get-remote-data",(remoteData)=>{
                this.setData(remoteData);
                this.render();
            })
        },
        render: function() { //render per la visualizzazione della tabella
            let html = '<table class="table table-focus table-striped"><thead class="sticky-on-top"><tr>';
            
            header.forEach(e => {
                html += '<th class="table-secondary">' + e + "</th>";
            });
            html += "</tr></thead><tbody>";

            let dataValues = Object.values(data);            
            
            dataValues.forEach(e => {
                html += '<tr><td><img class="img-mini" src="' + e.url + '"></td><td><a target="_blank" href="' + e.url + '"id="' + e.id + '" class="articleLink">' + e.url + ' </a></td><td><button type="button" id="delete-' + e.id + '" class="btn btn-danger deleteButton"> Delete</button></td></tr>';
            });

            html += "</tbody></table>";
            parentElement.innerHTML = html;

            document.querySelectorAll(".deleteButton").forEach(b => { //funzione del bottone elimina
                b.onclick = () => {
                    const imageId = parseInt(b.id.replace("delete-", ""));
                    
                    data = data.filter(e => e.id !== imageId);
                    
                    pubsub.publish("image-deleted", imageId);
                };
            });
        },
        setData: function(inputData) { //scrive i dati della tabella 
            data = inputData;
        },
        getData: function() { //prende i dati della tabella
            return data;
        }
    };
    return tableObject;
};