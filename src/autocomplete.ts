class Complete{

    private input: HTMLInputElement;
    private inputValue: string;
    private selector: string;
    private data: string[];
    private threshold: number;
    private container: HTMLUListElement;
    private dropDownData: string[];
    private isCaseSensitive: boolean;
    private highlight: boolean;

    constructor( options: {selector: string, data: string[], threshold: number, isCaseSensitive: boolean, highlight: boolean } ) {
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

        let patern = '.*' + this.inputValue.split('').join('\.*') + '.*';
        const regex = new RegExp(patern, ( this.isCaseSensitive === false ) ? 'i' : '');
        this.data.forEach(item => {
            if(regex.test(item)){
                this.dropDownData.push(item);
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

    private populateDropdown(): void
    {
        if (this.dropDownData.length === 0) {
            return;
        }

        this.dropDownData.forEach(element => {
            let item = <HTMLLIElement>(document.createElement('li'));
            item.tabIndex = 0;
            let ouput = ( this.highlight === true ) ? this.parseHighlighting(element): element;
            item.classList.add('ac-item');
            item.innerHTML = ouput;

            item.addEventListener('focus', (e) => {
                console.log(item.innerHTML);
                this.inputValue = item.innerHTML;
            })
            this.container.appendChild<HTMLLIElement>(item);
        })
        return;
    }

    private parseHighlighting(element: string): string
    {
        // need to loop for long term and to smaller parts of the search string

        let index = element.indexOf(this.inputValue);
        let highlight = element.substring(0,index) + '<span>' + element.substring(index, index+this.inputValue.length) + '</span>' + element.substring(index + this.inputValue.length, element.length);
        return highlight;
    }

    private clearDropdown()
    {
        this.dropDownData = [];
        while(this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        return;
    }

    private applyOptions( {selector, data, threshold = 0, isCaseSensitive = false, highlight = false}: 
        {selector: string, data: string[], threshold: number, isCaseSensitive: boolean, highlight: boolean} ):void {
        
        this.selector = selector;
        this.data = data;
        this.threshold = threshold;
        this.isCaseSensitive = isCaseSensitive;
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