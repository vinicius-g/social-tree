class Form {
    constructor(formId, titleId, buttonId, createButtonId, editButtonId, selectedFunction) {
        this.button = document.getElementById(buttonId);
        this.createButton = document.getElementById(createButtonId);
        this.editButton = document.getElementById(editButtonId);
        this.form = document.getElementById(formId);
        this.formTitleElement = document.getElementById(titleId);
        this.formTitleText = this.formTitleElement.innerText;
        this.backdrop = document.getElementById('backdrop');
        this.selectedFunction = selectedFunction;
    }

    initForm() {
        this.button.addEventListener('click', this.#selectFunction.bind(this));
    }

    #selectFunction() {
        switch (this.selectedFunction) {
            case 'open-form': {
                this.#openForm();
            } break;

            case 'close-form': {
                this.#closeForm();
            } break;
        }
    }

    #openForm() {
        this.formTitleElement.innerText = this.formTitleText;
        this.createButton.classList.remove('hide');
        this.editButton.classList.add('hide');

        this.form.classList.add('show');
        this.backdrop.classList.add('show');

        this.backdrop.addEventListener('click', this.#closeForm.bind(this), {once: true});
    }

    #closeForm() {
        this.form.classList.remove('show');
        this.backdrop.classList.remove('show');
    }
}

const LinkForm = new Form('links-form', 'links-form-title', 'add-link', 'create-link', 'edit-link', 'open-form');
const CloseLinkForm = new Form('links-form', 'links-form-title', 'close-links-form', 'create-link', 'edit-link','close-form');
const SocialMediaForm = new Form('social-media-form', 'social-media-form-title', 'add-social-media', 'create-social-media', 'edit-social-media', 'open-form');
const CloseSocialMediaForm = new Form('social-media-form', 'social-media-form-title', 'close-social-media-form', 'create-social-media', 'edit-social-media', 'close-form');

const FormController = {
    linkForm: LinkForm,
    closeLinkForm: CloseLinkForm,
    socialMediaForm: SocialMediaForm,
    closeSocialMediaForm: CloseSocialMediaForm
}

export default FormController;