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
        // process Data based on the type of it
        // default is json
        switch (this.dataType) {
            case 'array':
                let patern = '.*' + this.inputValue + '.*';
                const regex = new RegExp(patern, (!this.isCaseSensitive) ? 'i' : '');
                this.data.forEach(item => {
                    if (regex.test(item)) {
                        this.dropDownData.indexOf(item) === -1 ? this.dropDownData.push(item) : console.log(item);
                    }
                });
                break;
            default:
                break;
        }
        this.populateDropdown();
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
        this.dropDownData.forEach(element => {
            let item = (document.createElement('li'));
            item.tabIndex = 0;
            let ouput = (this.highlight === true) ? this.parseHighlighting(element) : element;
            item.classList.add('ac-item');
            item.innerHTML = ouput;
            item.addEventListener('focus', (e) => {
                console.log(item.innerHTML);
                this.inputValue = item.innerHTML;
            });
            this.container.appendChild(item);
        });
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
    applyOptions({ selector, data, dataType = 'json', threshold = 0, isCaseSensitive = false, highlight = false }) {
        this.selector = selector;
        this.data = data;
        this.dataType = dataType;
        this.threshold = threshold;
        this.isCaseSensitive = isCaseSensitive;
        this.highlight = highlight;
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
            if (this.input.value.length <= this.threshold) {
                this.clearDropdown();
            }
        });
        return;
    }
}
