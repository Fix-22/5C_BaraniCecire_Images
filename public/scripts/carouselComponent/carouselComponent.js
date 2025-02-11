export const generateCarouselComponent = (parentElement) => {
    let images;

    return {
        build: (inputImages) => {
            images=inputImages;
        },
        render: () => {
            let html="";
            let first = true;

            images.forEach(element => {
                html+='<div class="carousel-item' + (first ? ' active"' : '"') + '><img src="'+element.url+'"class="d-block w-100"></div>';
                first = false;
            });
            parentElement.innerHTML=html;
        }
    }
}