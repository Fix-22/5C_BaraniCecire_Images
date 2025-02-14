export const generateMiddleware=()=>{
return{
    load: ()=>{
        return new Promise((resolve, reject) => {
            fetch("/get").then(r => r.json()).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            })
        });
    },

    delete: (id) =>{

        fetch("/delete/"+id, {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json()).then(data => {
            return data;
        })
    },
    upload: async(image)=>{
        const formData = new FormData();
        formData.append("file", inputFile.files[0]);
        const body = formData;
        const fetchOptions = {
        method: 'post',
        body: body
    } ;
        try {
            const res = await fetch("/upload", fetchOptions);
            const data = await res.json();    
        } catch (e) {
        console.log(e);
        }
    }
    }
}
