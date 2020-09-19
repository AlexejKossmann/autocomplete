"use strict";
class Complete {
    constructor(options) {
        this.applyOptions(options);
        this.createDropdownContainer();
        this.dropDownData = [];
        this.init();
    }
    getData() {
        return this.data;
    }
    setDropdownData() {
        this.clearDropdown();
        let search = this.inputValue;
        if (!this.caseSensitive) {
            search = search.toLowerCase();
        }
        let patern = '.*' + search.split('').join('.*') + '.*';
        const regex = new RegExp(patern);
        this.data.forEach(item => {
            if (this.caseSensitive) {
                if (regex.test(item)) {
                    this.dropDownData.push(item);
                }
            }
            else {
                if (regex.test(item.toLowerCase())) {
                    this.dropDownData.push(item);
                }
            }
        });
        this.populateDropdown();
    }
    createDropdownContainer() {
        var _a;
        if (this.selector === '') {
            return;
        }
        let elements = document.querySelectorAll(this.selector);
        if (elements.length === 0) {
            console.error('Not posible to create autocomplete element, id: ' + this.selector + ' not found.');
            return;
        }
        if (elements.length > 1) {
            console.error('Not posible to create autocomplete element, id: ' + this.selector + ' is not unique.');
            return;
        }
        this.input = elements[0];
        this.container = (document.createElement('ul'));
        this.container.classList.add('autocomplete-container');
        (_a = elements[0].parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(this.container);
        return;
    }
    populateDropdown() {
        if (this.dropDownData.length === 0) {
            return;
        }
        this.dropDownData.forEach(element => {
            let item = (document.createElement('li'));
            item.classList.add('autocomplete-item');
            item.innerHTML = element;
            this.container.appendChild(item);
        });
        return;
    }
    clearDropdown() {
        this.dropDownData = [];
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        return;
    }
    applyOptions({ selector, data, threshold = 0, caseSensitive = false }) {
        this.selector = selector;
        this.data = data;
        this.threshold = threshold;
        this.caseSensitive = caseSensitive;
    }
    init() {
        if (this.container.hasChildNodes()) {
            this.clearDropdown();
        }
        this.input.addEventListener('input', () => {
            if (this.input.value.length > this.threshold) {
                this.inputValue = this.input.value;
                this.setDropdownData();
            }
        });
        return;
    }
}
