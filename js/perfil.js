class Perfil {
    constructor() {
        this.inputImage = document.getElementById('input-image');
        this.imagePreview = document.getElementById('image-preview');
        this.addImageButton = document.getElementById('add-image');
        this.editImageButton = document.getElementById('edit-image');
    }

    initPerfil() {
        this.inputImage.addEventListener('change', this.#processImage.bind(this));
    }

    #updatePerfilIcon() {
        this.addImageButton.classList.add('hide');
        this.editImageButton.classList.remove('hide');
    }

    #getImageSrc() {
        const imageFile = this.inputImage.files[0];
        const imagePreviewUrl = URL.createObjectURL(imageFile);

        return imagePreviewUrl;
    }

    #updateImageSrc(imagePreviewUrl) {
        this.imagePreview.src = imagePreviewUrl;
        this.imagePreview.classList.add('show');
    }

    #processImage() {
        this.#updatePerfilIcon();

        const imagePreviewUrl = this.#getImageSrc();

        this.#updateImageSrc(imagePreviewUrl);
    }
}

const PerfilChange = new Perfil();

const PerfilController = {
    perfilChange: PerfilChange
}

export default PerfilController;