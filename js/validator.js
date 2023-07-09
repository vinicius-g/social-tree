import ErrorTreatment from './errors.js';

export default class Validator extends ErrorTreatment {
    validateValue(inputValue) {
        const validationResult = inputValue.validations.find((validation) => {
            return this.#validate(validation, inputValue);
        }) || {message: 'ok'};

        return validationResult.message;
    }

    #validate(validation, inputValue) {
        const trimmedValue = inputValue.value.trim();
        const possibleOptions = validation?.options;

        switch (validation.validation) {
            case 'isNull': {
                return this.#validateNull(trimmedValue);
            } break;

            case 'isUndefined': {
                return this.#validateUndefined(trimmedValue);
            } break;

            case 'isEmpty': {
                return this.#validateEmpty(trimmedValue);
            } break;

            case 'isNotUrl': {
                return this.#validateUrl(trimmedValue);
            } break;

            case 'isNotValid': {
                return this.#validateValid(trimmedValue, possibleOptions);
            } break;
        }
    }

    #validateNull(trimmedValue) {
        if (trimmedValue === null) return true;

        return false;
    }

    #validateUndefined(trimmedValue) {
        if (trimmedValue === undefined) return true;

        return false;
    }

    #validateEmpty(trimmedValue) {
        if (trimmedValue === '') return true;

        return false;
    }

    #validateUrl(trimmedValue) {
        if (!trimmedValue.match(/(https?:\/\/)[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)) return true;

        return false;
    }

    #validateValid(trimmedValue, possibleOptions) {
        if (!possibleOptions.find((option) => option === trimmedValue)) return true;

        return false;
    }
}