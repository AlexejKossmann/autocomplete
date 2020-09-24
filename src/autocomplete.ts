class Complete{

    private container: HTMLUListElement;
    private data: string[]|object[];
    private dropDownData: string[];
    private highlight: boolean;
    private input: HTMLInputElement;
    private inputValue: string;
    private isCaseSensitive: boolean;
    private limit: number;
    private path: string;
    private preparedData: string[];
    private selector: string;
    private threshold: number;

    constructor( options: {selector: string, data: string[]|object[], path: string, threshold: number, isCaseSensitive: boolean, highlight: boolean, limit: number } ) 
    {
        this.applyOptions(options);
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
        const regex = new RegExp(patern, ( !this.isCaseSensitive ) ? 'i' : '');
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

        this.dropDownData = this.dropDownData.slice(0, this.limit);
    }

    // looking for selector and creates new ul element if found
    private createDropdownContainer()
    {
        if (this.selector === '') {
            return;
        }

        let elements = document.querySelectorAll<HTMLInputElement>(this.selector);

        if(elements.length === 0) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.selector + ' not found.');
            return;
        }
        
        if(elements.length > 1) {
            console.error('Autocomplete: Not possible to create autocomplete element, id: ' + this.selector + ' is not unique.');
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
            let ouput = ( this.highlight === true ) ? this.parseHighlighting(this.dropDownData[i]): this.dropDownData[i];
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
        if (this.isCaseSensitive) {
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

    // applies all the options passed in the opject creation
    private applyOptions( {selector, data, path = '', threshold = 0, isCaseSensitive = false, highlight = false, limit = 10}: 
        {selector: string, data: string[]|object[], path: string, threshold: number, isCaseSensitive: boolean, highlight: boolean, limit: number} ):void
    {
        
        this.data = data;
        this.highlight = highlight;
        this.isCaseSensitive = isCaseSensitive;
        this.limit = limit;
        this.path = path;
        this.selector = selector;
        this.threshold = threshold;
    }

    private prepareData() 
    {
        if (Array.isArray(this.data)){
            this.data.forEach((element: any) => {
                switch(typeof element) {
                    case 'string':
                        this.preparedData.push(element);
                        break;
                    case 'object':
                        //here its needed to get the values from jsonObject
                        if (this.path && this.path !== '') {
                            this.preparedData.push(element.capital);
                        } else {

                        }                           

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
            if(this.input.value.length > this.threshold) {
                this.inputValue = this.input.value;
                this.setDropdownData();
            }

            if(this.input.value.length <= this.threshold) {
                this.clearDropdown();
            }
        })
        
        return;
    }

}