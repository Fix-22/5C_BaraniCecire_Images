export const generateFormComponent = (parentElement, pubsub) => {
    const formObject = {
        render : function() {
            let html = 
            `<form class="container-fluid">
                <div class="mb-3">
                    <label for="formFile" class="form-label">Select image</label>
                    <input class="form-control" type="file" id="formFile">
                </div>
                
                <div id="resultLabel" class="form-text text-danger text-center"></div>
            </form>
                            ` ;
            parentElement.innerHTML = html ;

            const inputFile = document.getElementById("formFile");
            document.querySelectorAll(".clearForm").forEach(b => {
                b.onclick = () => {
                    if (b.id === "submitButton") {
                        if (inputFile.files.length>0) {
                            const formData = new FormData();
                            formData.append("file", inputFile.files[0]); 
                            const body = formData;
                            pubsub.publish("form-submit", body);
                        }
                        else {
                            resultLabel.innerText = "Not all forms compiled";
                        }
                    }
                    else {
                        this.clear();
                    }
                };
            })
        },
        clear: () => {
            document.getElementById("resultLabel").innerText = "";
            document.getElementById("formFile").value="";
        },
        setError: (error) => {
            document.getElementById("resultLabel").innerText = error;
        }
    }
    return formObject;
};