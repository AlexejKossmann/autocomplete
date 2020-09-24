// let dumyData = ['Berlin', 'Leipzig', 'London', 'Moscow', 'Washington', 'Tokio', 'Dresden'];

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
        limit: 4,
        selector: '#selector',
        data: json,
        path: 'capital',
        highlight: true
    }
    new Complete(options);
});