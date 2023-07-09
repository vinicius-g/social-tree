import Validator from './validator.js';

class Link extends Validator {
    constructor() {
        super();
        this.linksList = JSON.parse(localStorage.getItem('linksList')) || [];
        this.linkId = this.linksList.length ? JSON.parse(localStorage.getItem('linksList')).pop().id + 1 : 0;
        this.linkTree = document.getElementById('link-tree');
        this.createLinkButton = document.getElementById('create-link');
        this.editLinkButton = document.getElementById('edit-link');
        this.linkTitleInput = document.getElementById('link-title');
        this.linkUrlInput = document.getElementById('link-url');
        this.form = document.getElementById('links-form');
        this.formTitleElement = document.getElementById('links-form-title');
        this.formEditTitleText = 'Editar link';
        this.backdrop = document.getElementById('backdrop');
    }

    initLink() {
        this.createLinkButton.addEventListener('click', this.#processLink.bind(this));
        this.editLinkButton.addEventListener('click', (e) => {
            this.#editLink(e);
        });
        if (this.linksList.length > 0) this.#loadLocalStorage();
    }

    #getValues() {
        const linkTitle = {
            value: this.linkTitleInput.value,
            validations: [
                {
                    validation: 'isNull',
                    message: 'Título não pode ser nulo'
                },
                {
                    validation: 'isEmpty',
                    message: 'Título não pode ser vazio'
                }
            ]
        }

        const linkUrl = {
            value: this.linkUrlInput.value,
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

        return { linkTitle, linkUrl };
    }

    #validateLink(linkTitle, linkUrl) {
        const linkTitleMessage = this.validateValue(linkTitle);

        const linkUrlMessage = this.validateValue(linkUrl);

        return { linkTitleMessage, linkUrlMessage };
    }

    #constructLinkContainer(element, id, containerClass) {
        const container = document.createElement(element);
        container.id = id;
        container.classList.add(...containerClass);

        return container;
    }

    #constructLinkButton(id, buttonClass) {
        const button = document.createElement('button');
        button.id = id;
        button.classList.add(...buttonClass);

        return button;
    }

    #constructLinkIcon(iconClass) {
        const icon = document.createElement('i');
        icon.classList.add(...iconClass);

        return icon;
    }

    #constructLink(id, url, text, linkClass) {
        const link = document.createElement('a');
        link.id = id;
        link.href = url;
        link.target = '_blank';
        link.title = text;
        link.innerText = text;
        link.classList.add(...linkClass);

        return link;
    }

    #activateEditionFunction(element) {
        element.addEventListener('click', (e) => {
            const containerSelected = e.currentTarget;
            const itemSelectedId = e.target.id;
            const functionality = itemSelectedId.substring(0, itemSelectedId.indexOf('-'));
            const idNumber = Number(itemSelectedId.replace(/\D/g, ''));

            switch (functionality) {
                case 'edit': {
                    this.#openEditFormLink(idNumber);
                } break;

                case 'delete': {
                    this.#deleteLink(containerSelected, idNumber);
                } break;
            }
        })
    }

    #createLink(linkTitle, linkUrl, linkId) {
        const linkContainer = this.#constructLinkContainer('div', `link-container-${linkId}`, ['link-container']);

        this.#activateEditionFunction(linkContainer);

        const editButton = this.#constructLinkButton(`edit-link-${linkId}`, ['edit-link-button']);

        const editIcon = this.#constructLinkIcon(['bx', 'bxs-pencil']);

        const deleteButton = this.#constructLinkButton(`delete-link-${linkId}`, ['delete-link-button']);

        const deleteIcon = this.#constructLinkIcon(['bx', 'bxs-trash-alt']);

        const link = this.#constructLink(`link-${linkId}`, linkUrl, linkTitle, ['link']);

        editButton.appendChild(editIcon);
        linkContainer.appendChild(editButton);

        deleteButton.appendChild(deleteIcon);
        linkContainer.appendChild(deleteButton);

        linkContainer.appendChild(link);

        this.linkTree.insertBefore(linkContainer, this.linkTree.lastElementChild);
    }

    #closeLinkForm() {
        this.form.classList.remove('show');
        this.backdrop.classList.remove('show');
    }

    #clearInputs() {
        this.linkTitleInput.value = '';
        this.linkUrlInput.value = '';
    }

    #openEditFormLink(selectedItemId) {
        const selectedLink = document.getElementById(`link-${selectedItemId}`);

        this.formTitleElement.innerText = this.formEditTitleText;
        this.linkTitleInput.value = selectedLink.innerText;
        this.linkUrlInput.value = selectedLink.href;

        this.createLinkButton.classList.add('hide');
        this.editLinkButton.classList.remove('hide');

        this.form.classList.add('show');
        this.backdrop.classList.add('show');

        this.backdrop.addEventListener('click', this.#closeLinkForm.bind(this), {once: true});
        this.editLinkButton.id = selectedItemId;
    }

    #editLink(event) {
        const selectedItemId = Number(event.target.id);

        const { linkTitle, linkUrl } = this.#getValues();

        const { linkTitleMessage, linkUrlMessage } = this.#validateLink(linkTitle, linkUrl);

        const inputsObjects = [
            {
                input: this.linkTitleInput,
                message: linkTitleMessage
            },
            {
                input: this.linkUrlInput,
                message: linkUrlMessage
            }
        ];

        this.treatErrors(inputsObjects);

        if (linkTitleMessage === 'ok' && linkUrlMessage === 'ok') {
            const selectedLink = document.getElementById(`link-${selectedItemId}`);
            selectedLink.href = linkUrl.value;
            selectedLink.innerText = linkTitle.value;
            selectedLink.title = linkTitle.value;

            const editedInput = {
                'id': selectedItemId,
                'text': linkTitle.value,
                'href': linkUrl.value
            }

            this.#updateLocalStorage('edit', editedInput);
            this.#closeLinkForm();
            this.#clearInputs();
        }
    }

    #deleteLink(containerSelected, selectedItemId) {
        const input = {
            'id': selectedItemId
        }

        containerSelected.remove();

        this.#updateLocalStorage('delete', input);
    }

    #saveLocalStorage(linkTitle, linkUrl) {
        const newElement = {
            'id': this.linkId,
            'text': linkTitle,
            'href': linkUrl
        };

        this.linksList.push(newElement);
        localStorage.setItem('linksList', JSON.stringify(this.linksList));
    }

    #updateLocalStorage(updateType, input) {
        switch (updateType) {
            case 'edit': {
                const selectedLink = this.linksList.find((link) => link.id === input.id);

                selectedLink.text = input.text;
                selectedLink.href = input.href;

                localStorage.setItem('linksList', JSON.stringify(this.linksList));
            } break;

            case 'delete': {
                const newLinksList = this.linksList.filter((link) => link.id !== input.id);

                this.linksList = newLinksList;
                localStorage.setItem('linksList', JSON.stringify(this.linksList));
            } break;
        }
    }

    #loadLocalStorage() {
        this.linksList.forEach((link) => {
            this.#createLink(link.text, link.href, link.id);
        });
    }

    #processLink() {
        const { linkTitle, linkUrl } = this.#getValues();

        const { linkTitleMessage, linkUrlMessage } = this.#validateLink(linkTitle, linkUrl);

        const inputsObjects = [
            {
                input: this.linkTitleInput,
                message: linkTitleMessage
            },
            {
                input: this.linkUrlInput,
                message: linkUrlMessage
            }
        ];

        this.treatErrors(inputsObjects);

        if (linkTitleMessage === 'ok' && linkUrlMessage === 'ok') {
            this.#createLink(linkTitle.value, linkUrl.value, this.linkId);
            this.#saveLocalStorage(linkTitle.value, linkUrl.value);
            this.#closeLinkForm();
            this.#clearInputs();

            this.linkId++;
        };
    }
}

const AddLink = new Link();

const LinkController = {
    addLink: AddLink
}

export default LinkController;