export const generateCarouselComponent = (parentElement, pubsub) => {
    let images;

    const carouselObject = {
        build: function(inputImages) {
            images=inputImages;
            pubsub.subscribe("get-remote-data",(remoteData)=>{
                images = remoteData;
                this.render();
            })
        },
        render: function() { //render per la visualizzazione del carosello
            let html="";
            let first = true;

            images.forEach(element => {
                html+='<div class="carousel-item' + (first ? ' active"' : '"') + '><img src="'+element.url+'"class="d-block w-100"></div>';
                first = false;
            });
            parentElement.innerHTML=html;
        }
    }

    return carouselObject;
}