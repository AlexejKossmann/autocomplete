"use strict";
const DefaultOptions = {
    selector: '',
    data: [],
    threshold: 0,
    key: '',
    isCaseSensitive: false,
    highlight: false,
    limit: 10
};
class Complete {
    constructor(options) {
        this.options = Object.assign(Object.assign({}, DefaultOptions), options);
        this.createDropdownContainer();
        this.preparedData = [];
        this.dropDownData = [];
        this.init();
    }
    setDropdownData() {
        this.clearDropdown();
        let patern = '.*' + this.inputValue + '.*';
        const regex = new RegExp(patern, (!this.options.isCaseSensitive) ? 'i' : '');
        this.preparedData.forEach(item => {
            if (item !== null) {
                if (regex.test(item)) {
                    void (this.dropDownData.indexOf(item) && this.dropDownData.push(item));
                }
            }
        });
        this.sortData();
        this.populateDropdown();
    }
    sortData() {
        if (this.dropDownData.length === 0) {
            return;
        }
        this.dropDownData.sort((a, b) => {
            if (a.indexOf(this.inputValue) === -1) {
                return 1;
            }
            ;
            if (b.indexOf(this.inputValue) === -1) {
                return -1;
            }
            ;
            if (a.indexOf(this.inputValue) === 0) {
                return -1;
            }
            ;
            if (b.indexOf(this.inputValue) === 0) {
                return 1;
            }
            ;
            if (a < b) {
                return -1;
            }
            ;
            if (a > b) {
                return 1;
            }
            ;
            return 0;
        });
        this.dropDownData = this.dropDownData.slice(0, this.options.limit);
    }
    createDropdownContainer() {
        var _a;
        if (this.options.selector === '') {
            return;
        }
        let elements = document.querySelectorAll(this.options.selector);
        if (elements.length === 0) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.options.selector + ' not found.');
            return;
        }
        if (elements.length > 1) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.options.selector + ' is not unique.');
            return;
        }
        this.input = elements[0];
        this.container = (document.createElement('ul'));
        this.container.classList.add('ac-result-container');
        (_a = elements[0].parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(this.container);
        return;
    }
    populateDropdown() {
        if (this.dropDownData.length === 0) {
            return;
        }
        for (let i = 0; i <= (this.dropDownData.length - 1); i++) {
            let item = (document.createElement('li'));
            item.tabIndex = 0;
            let ouput = (this.options.highlight === true) ? this.parseHighlighting(this.dropDownData[i]) : this.dropDownData[i];
            item.classList.add('ac-item');
            item.innerHTML = ouput;
            item.addEventListener('focus', (e) => {
                this.inputValue = item.innerHTML;
            });
            this.container.appendChild(item);
        }
        return;
    }
    parseHighlighting(element) {
        let index = 0;
        if (this.options.isCaseSensitive) {
            index = element.indexOf(this.inputValue);
        }
        else {
            index = element.toLowerCase().indexOf(this.inputValue.toLowerCase());
        }
        return element.substring(0, index) + '<span>' + element.substring(index, index + this.inputValue.length) + '</span>' + element.substring(index + this.inputValue.length, element.length);
    }
    clearDropdown() {
        this.dropDownData = [];
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        return;
    }
    prepareData() {
        if (Array.isArray(this.options.data)) {
            this.options.data.forEach((element) => {
                switch (typeof element) {
                    case 'string':
                        this.preparedData.push(element);
                        break;
                    case 'object':
                        Object.keys(element).forEach((value) => {
                            if (element[value] === null) {
                                return;
                            }
                            if (typeof element[value] !== 'string') {
                                return;
                            }
                            if (this.options.key === '') {
                                this.preparedData.push(element[value]);
                            }
                            if (this.options.key === value) {
                                this.preparedData.push(element[value]);
                            }
                        });
                        break;
                }
            });
        }
    }
    init() {
        if (this.container.hasChildNodes()) {
            this.clearDropdown();
        }
        this.prepareData();
        this.input.addEventListener('input', () => {
            if (this.input.value.length > this.options.threshold) {
                this.inputValue = this.input.value;
                this.setDropdownData();
            }
            if (this.input.value.length <= this.options.threshold) {
                this.clearDropdown();
            }
        });
        return;
    }
}
