class SocialMediaForm {
    constructor() {
        this.root = document.querySelector(':root');
        this.socialMedia = document.getElementById('social-media');
        this.socialMediaPreview = document.getElementById('social-media-preview');
        this.socialMediaOptions = document.getElementById('social-media-options');
        this.dropdownChildrenNumber = this.socialMediaOptions.childElementCount;
        this.dropdownChildren = Array.from(this.socialMediaOptions.children);
        this.dropdownHeight = (25 * this.dropdownChildrenNumber) + 4;
    }

    initSocialMediaForm() {
        this.socialMedia.addEventListener('click', (e) => {
            this.#dropdownMenu(e);
        });
        this.socialMediaOptions.addEventListener('click', (e) => {
            this.#selectItem(e);
        });
    }

    #dropdownMenu(event) {
        this.dropdownChildrenNumber = this.socialMediaOptions.childElementCount;
        this.dropdownHeight = (25 * this.dropdownChildrenNumber) + 4;

        if (event.currentTarget.classList.contains('active')) {
            this.socialMediaOptions.addEventListener('transitionend', () => {
                this.socialMediaOptions.classList.add('hide');
            }, {once: true});
        } else {
            this.socialMediaOptions.classList.remove('hide');
        }

        this.socialMedia.classList.toggle('active');

        this.root.style.setProperty('--dropdown-height', `${this.dropdownHeight}px`);
    }

    #selectItem(event) {
        this.dropdownChildren = Array.from(this.socialMediaOptions.children);

        this.dropdownChildren.forEach((child) => {
            child.classList.remove('selected');
        });

        const selectedItem = event.target.innerText;
        const selectedItemData = event.target.getAttribute('data-social-media');
        event.target.classList.add('selected');

        this.socialMediaPreview.innerText = selectedItem;
        this.socialMediaPreview.setAttribute('data-social-media', selectedItemData);
    }
}

const SocialMediaSelectOptions = new SocialMediaForm;

const SocialMediaFormController = {
    socialMediaForm: SocialMediaSelectOptions
}

export default SocialMediaFormController;