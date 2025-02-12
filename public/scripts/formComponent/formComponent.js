export const generateFormComponent = (parentElement, pubsub) => {
    let onEdit;
    const formObject = {
        render : function() {
            let html = 
            `<form class="container-fluid">
                <div class="row md-row">
                    <div class="col">
                        <input type="text" class="form-control"
                            placeholder="Main image link" id="playMainLink">
                    </div>
                </div>
                
                    <div id="resultLabel" class="form-text text-danger text-center"></div>
                </div>
            </form>
                            ` ;
            parentElement.innerHTML = html ;
            document.getElementById("adminFormTitle").innerText = "Add article";

            let workTitleInput = document.getElementById("workTitleInput") ;
            let textInput = document.getElementById("textInput") ;
            let playMainLink = document.getElementById("playMainLink") ;
            let resultLabel = document.getElementById("resultLabel");
            let newImages = [] ;

            document.querySelectorAll(".clearForm").forEach(b => {
                b.onclick = () => {
                    if (b.id === "submitButton") {
                        if (workTitleInput.value && textInput.value && playMainLink.value && playSecondLink.value && playThirdLink.value && playLocation.value && playCharacters.value && playPubblicationYear.value && playEra.value) {
                            document.getElementById("adminFormTitle").innerText = "Add article";

                            if (playMainLink.value) newImages.push(playMainLink.value)
    
                            let article = {} ;
                            let title = workTitleInput.value ;
                            article.place = {
                                "name": playLocation.value,
                                "coords": []
                            } ;
                            article.images = newImages ;
                            newImages = [];

                            let fullArticle = {
                                "title": title,
                                "article": article
                            }
                            
                            pubsub.publish("form-submit", fullArticle);
                        }
                        else {
                            resultLabel.innerText = "Not all forms compiled";
                        }
                    }
                    else {
                        onEdit = false;
                        document.getElementById("adminFormTitle").innerText = "Add article";
                        textInput.value = "" ;
                        playMainLink.value = "" ;
                        resultLabel.innerText = "";
                    }
                };
            })
        },
        setInputsValue : (title, articleDictionary) => {
            onEdit = true;
            document.getElementById("adminFormTitle").innerText = "Edit article (" + title + ")";
            if (title) document.getElementById("workTitleInput").value = title ;
            if (articleDictionary.resume) document.getElementById("textInput").value = articleDictionary.resume ;
            if (articleDictionary.images[0]) document.getElementById("playMainLink").value = articleDictionary.images[0] ;
        },
        clear: () => {
            onEdit = false;
            document.getElementById("adminFormTitle").innerText = "Add article";
            document.getElementById("workTitleInput").value = "" ;
            document.getElementById("textInput").value = "" ;
            document.getElementById("playMainLink").value = "" ;
            document.getElementById("resultLabel").innerText = "" ;
        },
        setError: (error) => {
            document.getElementById("resultLabel").innerText = error;
        },
        getEdit: () => {
            return onEdit;
        }
    }
    return formObject;
};



