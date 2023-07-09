import Validator from './validator.js'

class SocialMedia extends Validator {
    constructor() {
        super();
        this.socialMediasList = JSON.parse(localStorage.getItem('socialMediasList')) || [];
        this.socialMediaId = this.socialMediasList.length ? JSON.parse(localStorage.getItem('socialMediasList')).pop().id + 1 : 0;
        this.socialMediaIcons = [
            'bx bxl-github',
            'bx bxl-linkedin',
            'bx bxl-instagram',
            'bx bxl-facebook',
            'bx bxl-youtube',
            'bx bxl-twitch',
            'bx bxl-tiktok',
            'bx bxl-twitter'
        ];
        this.socialMedias = [
            'github',
            'linkedin',
            'instagram',
            'facebook',
            'youtube',
            'twitch',
            'tik tok',
            'twitter'
        ];
        this.addSocialMediaButton = document.getElementById('add-social-media');
        this.socialLinks = document.getElementById('social-links');
        this.createSocialMediaButton = document.getElementById('create-social-media');
        this.editSocialMediaButton = document.getElementById('edit-social-media');
        this.socialMediaPreview = document.getElementById('social-media-preview');
        this.socialMediaUrlInput = document.getElementById('social-media-url');
        this.socialMediaOptions = document.getElementById('social-media-options');
        this.form = document.getElementById('social-media-form');
        this.formTitleElement = document.getElementById('social-media-form-title');
        this.formEditTitleText = 'Editar rede social';
        this.backdrop = document.getElementById('backdrop');
    }

    initSocialMedia() {
        this.createSocialMediaButton.addEventListener('click', this.#processSocialMedia.bind(this));
        this.addSocialMediaButton.addEventListener('click', this.#clearInputs.bind(this));
        this.editSocialMediaButton.addEventListener('click', (e) => {
            this.#editSocialMedia(e);
        });
        if (this.socialMediasList.length > 0) this.#loadLocalStorage();
    }

    #getValues() {
        const socialMediaName = {
            value: this.socialMediaPreview.innerText,
            validation: [
            ]
        }

        const socialMedia = {
            value: this.socialMediaPreview.getAttribute('data-social-media'),
            validations: [
                {
                    validation: 'isUndefined',
                    message: 'Erro: recarregue a página'
                },
                {
                    validation: 'isEmpty',
                    message: 'Selecione uma rede social'
                },
                {
                    validation: 'isNotValid',
                    message: 'Opção de rede social indisponível',
                    options: this.socialMediaIcons
                }
            ]
        }

        const socialMediaUrl = {
            value: this.socialMediaUrlInput.value,
            validations: [
                {
                    validation: 'isNull',
                    message: 'Link não pode ser nulo'
                },
                {
                    validation: 'isEmpty',
                    message: 'Link não pode ser vazio'
                },
                {
                    validation: 'isNotUrl',
                    message: 'Link precisa ser uma URL'
                }
            ]
        }

        return { socialMediaName, socialMedia, socialMediaUrl }
    }

    #validateSocialMedia(socialMedia, socialMediaUrl) {
        const socialMediaMessage = this.validateValue(socialMedia);

        const socialMediaUrlMessage = this.validateValue(socialMediaUrl);

        return { socialMediaMessage, socialMediaUrlMessage };
    }

    #constructSocialMediaContainer(element, id, containerClass) {
        const container = document.createElement(element);
        container.id = id;
        container.classList.add(...containerClass);

        return container;
    }

    #constructSocialMediaButton(id, buttonClass) {
        const button = document.createElement('button');
        button.id = id;
        button.classList.add(...buttonClass);

        return button;
    }

    #constructSocialMediaLink(id, text, url, socialMediaClass) {
        const socialMedia = document.createElement('a');
        socialMedia.id = id;
        socialMedia.href = url;
        socialMedia.target = '_blank';
        socialMedia.title = text;
        socialMedia.classList.add(...socialMediaClass)

        return socialMedia;
    }

    #constructSocialMediaIcon(iconClass) {
        const icon = document.createElement('i');
        icon.classList.add(...iconClass);

        return icon;
    }

    #activateEditionFunction(element) {
        element.addEventListener('click', (e) => {
            const containerSelected = e.currentTarget;
            const itemSelectedId = e.target.id;
            const functionality = itemSelectedId.substring(0, itemSelectedId.indexOf('-'));
            const idNumber = Number(itemSelectedId.replace(/\D/g, ''));

            switch (functionality) {
                case 'edit': {
                    this.#openEditFormSocialMedia(idNumber);
                } break;

                case 'delete': {
                    this.#deleteSocialMedia(containerSelected, idNumber);
                } break;
            }
        })
    }

    #createSocialMedia(socialMediaClass, socialMediaUrl, socialMediaName, socialMediaId) {
        const socialMediaContainer = this.#constructSocialMediaContainer('div', `social-media-container-${socialMediaId}`, ['social-media-container']);

        this.#activateEditionFunction(socialMediaContainer);

        const editButton = this.#constructSocialMediaButton(`edit-social-media-${socialMediaId}`, ['edit-social-media-button']);

        const editIcon = this.#constructSocialMediaIcon(['bx', 'bxs-pencil']);

        const deleteButton = this.#constructSocialMediaButton(`delete-social-media-${socialMediaId}`, ['delete-social-media-button']);

        const deleteIcon = this.#constructSocialMediaIcon(['bx', 'bxs-trash-alt']);

        const socialMediaLink = this.#constructSocialMediaLink(`social-media-${socialMediaId}`, socialMediaName, socialMediaUrl, ['social-media']);

        const socialMediaIcon = this.#constructSocialMediaIcon(socialMediaClass.split(' '));

        editButton.appendChild(editIcon);
        socialMediaContainer.appendChild(editButton);

        deleteButton.appendChild(deleteIcon);
        socialMediaContainer.appendChild(deleteButton);

        socialMediaLink.appendChild(socialMediaIcon);
        socialMediaContainer.appendChild(socialMediaLink);

        this.socialLinks.insertBefore(socialMediaContainer, this.socialLinks.lastElementChild)
    }

    #removeSocialMediaOption(socialMediaClass) {
        const selectedSocialMedia = document.querySelector(`li[data-social-media='${socialMediaClass}']`);
        if (selectedSocialMedia) selectedSocialMedia.remove();

        if (this.socialMediaOptions.childElementCount === 0) this.#removeAddSocialMediaButton();
    }

    #removeAddSocialMediaButton() {
        this.addSocialMediaButton.remove();
    }

    #addSocialMediaOption(input) {
        const selectedSocialMedia = document.querySelector(`li[data-social-media='${input.iconClass}']`);

        if (!selectedSocialMedia) {
            const socialMediaItem = document.createElement('li');
            socialMediaItem.setAttribute('data-social-media', input.iconClass);
            socialMediaItem.innerText = input.socialMediaName;

            this.socialMediaOptions.appendChild(socialMediaItem);
        }
    }

    #closeSocialMediaForm() {
        this.form.classList.remove('show');
        this.backdrop.classList.remove('show');
    }

    #clearInputs() {
        this.socialMediaUrlInput.value = '';
        this.socialMediaPreview.innerText = 'Selecione uma rede';
        this.socialMediaPreview.setAttribute('data-social-media', '');
    }

    #openEditFormSocialMedia(selectedItemId) {
        const selectedSocialMedia = document.getElementById(`social-media-${selectedItemId}`);
        const selectedSocialMediaIcon = document.querySelector(`#social-media-${selectedItemId} i`);

        this.formTitleElement.innerText = this.formEditTitleText;
        this.socialMediaPreview.innerText = selectedSocialMedia.title;
        this.socialMediaPreview.setAttribute('data-social-media', selectedSocialMediaIcon.getAttribute('class'));

        this.socialMediaUrlInput.value = selectedSocialMedia.href;

        this.createSocialMediaButton.classList.add('hide');
        this.editSocialMediaButton.classList.remove('hide');

        this.form.classList.add('show');
        this.backdrop.classList.add('show');

        this.backdrop.addEventListener('click', this.#closeSocialMediaForm.bind(this), {once: true});
        this.editSocialMediaButton.id = selectedItemId;
    }

    #editSocialMedia(event) {
        const selectedItemId = Number(event.target.id);
        const selectedSocialMedia = document.getElementById(`social-media-${selectedItemId}`);
        const selectedSocialMediaIcon = document.querySelector(`#social-media-${selectedItemId} i`);
        const previousItemIcon = selectedSocialMediaIcon.className;
        const previousSocialMediaName = selectedSocialMedia.title;

        const { socialMediaName, socialMedia, socialMediaUrl } = this.#getValues();

        const { socialMediaMessage, socialMediaUrlMessage } = this.#validateSocialMedia(socialMedia, socialMediaUrl);

        const inputsObjects = [
            {
                input: this.socialMediaPreview,
                message: socialMediaMessage
            },
            {
                input: this.socialMediaUrlInput,
                message: socialMediaUrlMessage
            }
        ];

        this.treatErrors(inputsObjects);

        if (socialMediaMessage === 'ok' && socialMediaUrlMessage === 'ok') {
            selectedSocialMediaIcon.className = '';
            selectedSocialMediaIcon.classList.add(...socialMedia.value.split(' '));
            selectedSocialMedia.href = socialMediaUrl.value;
            selectedSocialMedia.title = socialMediaName.value;

            const editedInput = {
                'id': selectedItemId,
                'iconClass': socialMedia.value,
                'socialMediaName': socialMediaName.value,
                'href': socialMediaUrl.value
            }

            const previousInput = {
                'iconClass': previousItemIcon,
                'socialMediaName': previousSocialMediaName
            }

            this.#updateLocalStorage('edit', editedInput, previousInput);
            this.#removeSocialMediaOption(socialMedia.value);
            this.#closeSocialMediaForm();
            this.#clearInputs();
        }
    }

    #deleteSocialMedia(containerSelected, selectedItemId) {
        const input = {
            'id': selectedItemId,
            'iconClass':  document.querySelector(`#social-media-${selectedItemId} i`).getAttribute('class'),
            'socialMediaName': document.getElementById(`social-media-${selectedItemId}`).title
        };

        containerSelected.remove();

        this.#updateLocalStorage('delete', input);
    }

    #saveLocalStorage(socialMediaClass, socialMediaUrl, socialMediaName) {
        const newElement = {
            'id': this.socialMediaId,
            'iconClass': socialMediaClass,
            'socialMediaName': socialMediaName,
            'href': socialMediaUrl
        };

        this.socialMediasList.push(newElement);
        localStorage.setItem('socialMediasList', JSON.stringify(this.socialMediasList));
    }

    #updateLocalStorage(updateType, input, previousInput) {
        switch (updateType) {
            case 'edit': {
                const selectedSocialMediaItem = this.socialMediasList.find((socialMedia) => socialMedia.id === input.id);

                selectedSocialMediaItem.iconClass = input.iconClass;
                selectedSocialMediaItem.href = input.href;
                selectedSocialMediaItem.socialMediaName = input.socialMediaName;

                localStorage.setItem('socialMediasList', JSON.stringify(this.socialMediasList));

                if (previousInput.iconClass !== input.iconClass) {
                    input.iconClass = previousInput.iconClass;
                    input.socialMediaName = previousInput.socialMediaName;
                }

                this.#addSocialMediaOption(input);
            } break;

            case 'delete': {
                const newSocialMediasList = this.socialMediasList.filter((socialMedia) => socialMedia.id !== input.id);

                this.socialMediasList = newSocialMediasList;

                localStorage.setItem('socialMediasList', JSON.stringify(this.socialMediasList));

                this.#addSocialMediaOption(input);
            } break;
        }
    }

    #loadLocalStorage() {
        this.socialMediasList.forEach((socialMedia) => {
            this.#createSocialMedia(socialMedia.iconClass, socialMedia.href, socialMedia.socialMediaName, socialMedia.id)

            this.#removeSocialMediaOption(socialMedia.iconClass);
        });
    }

    #processSocialMedia() {
        const { socialMediaName, socialMedia, socialMediaUrl } = this.#getValues();

        const { socialMediaMessage, socialMediaUrlMessage } = this.#validateSocialMedia( socialMedia, socialMediaUrl);

        const inputsObjects = [
            {
                input: this.socialMediaPreview,
                message: socialMediaMessage
            },
            {
                input: this.socialMediaUrlInput,
                message: socialMediaUrlMessage
            }
        ];

        this.treatErrors(inputsObjects);

        if (socialMediaMessage === 'ok' && socialMediaUrlMessage === 'ok') {
            this.#removeSocialMediaOption(socialMedia.value);
            this.#createSocialMedia(socialMedia.value, socialMediaUrl.value, socialMediaName.value, this.socialMediaId);
            this.#saveLocalStorage(socialMedia.value, socialMediaUrl.value, socialMediaName.value);
            this.#closeSocialMediaForm();
            this.#clearInputs();

            this.socialMediaId++;
        }
    }
}

const AddSocialMedia = new SocialMedia();

const SocialMediaController = {
    addSocialMedia: AddSocialMedia
}

export default SocialMediaController;