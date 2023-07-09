export default class ErrorTreatment {
    treatErrors(inputObjects) {
        inputObjects.forEach((inputObject) => {
            if (inputObject.message === 'ok') {
                this.#removeError(inputObject.input);
            } else {
                this.#addError(inputObject.input, inputObject.message);
            }
        });
    }

    #addError(input, errorMessage) {
        const parentElement = input.parentElement;

        this.#addErrorStyle(parentElement);
        this.#addErrorMessage(parentElement, errorMessage);
    }

    #addErrorStyle(parentElement) {
        parentElement.classList.add('error');
    }

    #addErrorMessage(parentElement, errorMessage) {
        parentElement.setAttribute('data-error', errorMessage);
    }

    #removeError(input) {
        const parentElement = input.parentElement;

        this.#removeErrorStyle(parentElement);
        this.#removeErrorMessage(parentElement);
    }

    #removeErrorStyle(parentElement) {
        parentElement.classList.remove('error')
    }

    #removeErrorMessage(parentElement) {
        parentElement.removeAttribute('data-error')
    }
}