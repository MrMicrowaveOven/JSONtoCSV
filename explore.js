// var fs = require('fs');
// var data = JSON.parse(fs.readFileSync('trelldata_RAW.json'));



function convert(textData) {
  var csv = "Id,Name,ListName,LastEdited\n";
  var cardArray = [];
  var jsonData = JSON.parse(textData);
  var cards = jsonData.cards;
  var lists = jsonData.lists;
  jsonData.cards.forEach(function(card) {
    cardArray = [];
    cardArray.push('"' + card.id + '"');
    var name = card.name;
    var indices = [];
    for (var i = 0; i < name.length; i++) {
      if (name[i] === '"'){
        indices.push(i);
      }
    }
    indices.reverse().forEach(function(index) {
      name = name.slice(0, index) + '"' + name.slice(index, name.length);
    });
    cardArray.push('"' + name + '"');
    var listId = card.idList;
    var listById = lists.find(function(list) {
      return list.id === listId;
    });
    cardArray.push('"' + listById.name + '"');
    cardArray.push('"' + card.dateLastActivity + '"');
    csv += cardArray.join(",") + "\n";
    // console.log(cardArray.join() + "\n");
  });
  return csv;
}


function applyFile() {
  // console.log("Beginning!");
  // var input = event.target;
  var file = document.getElementById("jsonFile").files[0];
  // console.log(file);
  var reader = new FileReader();
  var csv;
  reader.onload = function() {
    // console.log("Done!");
    var text = reader.result;
    console.log(JSON.parse(text));
    csv = convert(text);
    giveCSV(csv);
    // console.log(csv.slice(0,1000));
  };
  reader.readAsText(file);
}

function giveCSV(csv) {
  var blob = new Blob([csv], {type: 'text/csv'});
  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, "TrelloCSV");
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = "TrelloCSV";
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}
