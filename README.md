### Autocomplete in pure JavaScript written in Typescript

This library is in pure JavaScript and is written in TypeScript. It is designed to be fast and have zero dependencies.

## Installation

## Configuration

### Options
Key             | Description   | Type  |Default
----------------|---------------|-------|--------
selector        | Selector to identify the input field with autocomplete | String      | - 
data            | Data to be autocompleted from | Array JSON | []  
key             | Name of the property in JSON Object to autoselect for | String | -
threshold       | Minimun number of characters to start render results | Number      | 0
debounce        | Idle duration after entering new character to start render results in milliseconds| Number       | 100
limit           | Maximum number of displayed resuls | Number | 10
isCaseSensitive | Case sensitivity in the search of results | Boolean | false
highlight       | Highlight the entered characters in the result list | Boolean | false