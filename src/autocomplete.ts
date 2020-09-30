interface AutocompleteOptions {
    readonly selector: string,
    data: string[]|object[]
readonly threshold: number,
    readonly isCaseSensitive?: boolean,
    readonly highlight?: boolean,
    readonly limit?: number,
}

const DefaultOptions: AutocompleteOptions = {
    selector: '',
    data: [],
    threshold: 0,
    isCaseSensitive: false,
    highlight: false,
    limit: 10
}

class Complete{

    private container: HTMLUListElement;
    private dropDownData: string[];
    private input: HTMLInputElement;
    private inputValue: string;
    private preparedData: string[];
    private options: AutocompleteOptions;

    constructor( options: AutocompleteOptions ) 
    {
        this.options = { ...DefaultOptions, ...options }
        this.createDropdownContainer();
        this.preparedData = [];
        this.dropDownData = [];
        this.init();
    }

    // setting dropdown data depending on the input value
    public setDropdownData() 
    {
        this.clearDropdown();
        let patern = '.*' + this.inputValue + '.*';
        const regex = new RegExp(patern, ( !this.options.isCaseSensitive ) ? 'i' : '');
        this.preparedData.forEach(item => {
            if (item !== null) {
                if (regex.test(item)) {
                    void(this.dropDownData.indexOf(item) && this.dropDownData.push(item));
                }
            }
        })

        this.sortData();

        this.populateDropdown();
    }

    private sortData() 
    {
        if (this.dropDownData.length === 0) {
            return;
        }
        
        this.dropDownData.sort((a: string, b: string) => {
            if(a.indexOf(this.inputValue) === -1) {return 1};
            if(b.indexOf(this.inputValue) === -1) {return -1};
            if(a.indexOf(this.inputValue) === 0) {return -1};
            if(b.indexOf(this.inputValue) === 0) {return 1};

            if(a<b){return -1;};
            if(a>b){return 1;};
            
            return 0; 
        })

        this.dropDownData = this.dropDownData.slice(0, this.options.limit);
    }

    // looking for selector and creates new ul element if found
    private createDropdownContainer()
    {
        if (this.options.selector === '') {
            return;
        }

        let elements = document.querySelectorAll<HTMLInputElement>(this.options.selector);

        if(elements.length === 0) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.options.selector + ' not found.');
            return;
        }
        
        if(elements.length > 1) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.options.selector + ' is not unique.');
            return;
        }

        this.input = elements[0];

        this.container = <HTMLUListElement>(document.createElement('ul'));
        this.container.classList.add('ac-result-container');

        elements[0].parentElement?.appendChild(this.container);
        return;
    }

    // creates li elements inside the result ul container 
    // depends on the dropdownData
    private populateDropdown(): void
    {
        if (this.dropDownData.length === 0) {
            return;
        }

        for(let i = 0; i <= (this.dropDownData.length - 1); i++) {
            let item = <HTMLLIElement>(document.createElement('li'));
            item.tabIndex = 0;
            let ouput = ( this.options.highlight === true ) ? this.parseHighlighting(this.dropDownData[i]): this.dropDownData[i];
            item.classList.add('ac-item');
            item.innerHTML = ouput;

            item.addEventListener('focus', (e) => {
                this.inputValue = item.innerHTML;
            })
            this.container.appendChild<HTMLLIElement>(item);
        }

        return;
    }

    // setting highlighting of the dropdown data depending on the input value
    private parseHighlighting(element: string): string
    {
        let index = 0;
        if (this.options.isCaseSensitive) {
            index = element.indexOf(this.inputValue);
        } else {
            index = element.toLowerCase().indexOf(this.inputValue.toLowerCase());
        }

        return element.substring(0,index) + '<span>' + element.substring(index, index+this.inputValue.length) + '</span>' + element.substring(index + this.inputValue.length, element.length);
    }

    // remove all li element inside the relut ul container
    private clearDropdown()
    {
        this.dropDownData = [];
        while(this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        return;
    }

    private prepareData() 
    {
        if (Array.isArray(this.options.data)){
            this.options.data.forEach((element: any) => {
                switch(typeof element) {
                    case 'string':
                        this.preparedData.push(element);
                        break;
                    case 'object':
                        //here its needed to get the values from jsonObject
                        this.preparedData.push(element.capital);
                        break;
                }
            })
        }
    }

    private init()
    {   
        if (this.container.hasChildNodes()) {
            this.clearDropdown();
        }

        this.prepareData();

        
        this.input.addEventListener('input', () => {
            if(this.input.value.length > this.options.threshold) {
                this.inputValue = this.input.value;
                this.setDropdownData();
            }

            if(this.input.value.length <= this.options.threshold) {
                this.clearDropdown();
            }
        })
        
        return;
    }

}