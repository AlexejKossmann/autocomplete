"use strict";
class Complete {
    constructor(options) {
        this.applyOptions(options);
        this.createDropdownContainer();
        this.preparedData = [];
        this.dropDownData = [];
        this.init();
    }
    setDropdownData() {
        this.clearDropdown();
        let patern = '.*' + this.inputValue + '.*';
        const regex = new RegExp(patern, (!this.isCaseSensitive) ? 'i' : '');
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
        this.dropDownData = this.dropDownData.slice(0, this.limit);
    }
    createDropdownContainer() {
        var _a;
        if (this.selector === '') {
            return;
        }
        let elements = document.querySelectorAll(this.selector);
        if (elements.length === 0) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.selector + ' not found.');
            return;
        }
        if (elements.length > 1) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.selector + ' is not unique.');
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
            let ouput = (this.highlight === true) ? this.parseHighlighting(this.dropDownData[i]) : this.dropDownData[i];
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
        if (this.isCaseSensitive) {
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
    applyOptions({ selector, data, path = '', threshold = 0, isCaseSensitive = false, highlight = false, limit = 10 }) {
        this.data = data;
        this.highlight = highlight;
        this.isCaseSensitive = isCaseSensitive;
        this.limit = limit;
        this.path = path;
        this.selector = selector;
        this.threshold = threshold;
    }
    prepareData() {
        if (Array.isArray(this.data)) {
            this.data.forEach((element) => {
                switch (typeof element) {
                    case 'string':
                        this.preparedData.push(element);
                        break;
                    case 'object':
                        if (this.path && this.path !== '') {
                            this.preparedData.push(element.capital);
                        }
                        else {
                        }
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
            if (this.input.value.length > this.threshold) {
                this.inputValue = this.input.value;
                this.setDropdownData();
            }
            if (this.input.value.length <= this.threshold) {
                this.clearDropdown();
            }
        });
        return;
    }
}
