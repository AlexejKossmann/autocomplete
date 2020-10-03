let dumyData = ['Berlin', 'Leipzig', 'London', 'Moscow', 'Washington', 'Tokio', 'Dresden'];

// let options = {
//     selector: '#selector',
//     data: dumyData,
//     path: 'capital',
//     highlight: true
// }
// new Complete(options);


fetch('./dist/countries.json')
.then(response => response.json())
.then((json) => {
    let options = {
        threshold: 0,
        selector: '#selector',
        key: 'capital',
        debounce: 200,
        data: json,
        highlight: true
    }
    new Complete(options);
});