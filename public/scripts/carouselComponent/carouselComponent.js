export const generateCarouselComponent = (parentElement) => {
    let images;

    return {
        build: (inputImages) => {
            images=inputImages;
        },
        render: () => {
            let html="";
            images.forEach(element => {
                html+='<div class="carousel-item"><img src="'+element+'"class="d-block w-100"></div>';
            });
            parentElement.innerHTLM=html;
        }
    }
}