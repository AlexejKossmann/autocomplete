class Complete{

    private input: HTMLInputElement;
    private inputValue: string;
    private selector: string;
    private data: string[];
    private threshold: number;
    private container: HTMLUListElement;
    private dropDownData: string[];
    private caseSensitive: boolean;
    private highlight: boolean;

    constructor( options: {selector: string, data: string[], threshold: number, caseSensitive: boolean, highlight: boolean } ) {
        this.applyOptions(options);
        this.createDropdownContainer();
        this.dropDownData = [];
        this.init();
    }

    public getData(): string[]
    {
        return this.data;   
    }

    public setDropdownData() 
    {
        this.clearDropdown();
        let search = this.inputValue;

        if (!this.caseSensitive){
            search = search.toLowerCase();
        }
        let patern = '.*' + search.split('').join('.*') + '.*';
        const regex = new RegExp(patern);
        this.data.forEach(item => {
            if(this.caseSensitive) {
                if(regex.test(item)){
                    this.dropDownData.push(item);
                }
            } else {
                if(regex.test(item.toLowerCase())){
                    this.dropDownData.push(item);
                }
            }
        })

        this.populateDropdown();
    }

    private createDropdownContainer()
    {
        if (this.selector === '') {
            return;
        }

        let elements = document.querySelectorAll<HTMLInputElement>(this.selector);

        if(elements.length === 0) {
            console.error('Not posible to create autocomplete element, id: ' + this.selector + ' not found.');
            return;
        }
        
        if(elements.length > 1) {
            console.error('Not posible to create autocomplete element, id: ' + this.selector + ' is not unique.');
            return;
        }

        this.input = elements[0];

        this.container = <HTMLUListElement>(document.createElement('ul'));
        this.container.classList.add('ac-result-container');

        elements[0].parentElement?.appendChild(this.container);
        return;
    }

    private populateDropdown()
    {
        if (this.dropDownData.length === 0) {
            return;
        }

        this.dropDownData.forEach(element => {
            let item = <HTMLLIElement>(document.createElement('li'));
            item.classList.add('ac-item');
            item.innerHTML = element;

            this.container.appendChild<HTMLLIElement>(item);
        })
        return;
    }

    private clearDropdown()
    {
        this.dropDownData = [];
        while(this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        return;
    }

    private applyOptions( {selector, data, threshold = 0, caseSensitive = false, highlight = false}: 
        {selector: string, data: string[], threshold: number, caseSensitive: boolean, highlight: boolean} ):void {
        
        this.selector = selector;
        this.data = data;
        this.threshold = threshold;
        this.caseSensitive = caseSensitive;
        this.highlight = highlight;
    }

    private init()
    {   
        if (this.container.hasChildNodes()) {
            this.clearDropdown();
        }
        
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