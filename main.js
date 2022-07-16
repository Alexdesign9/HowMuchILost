function isValidNumber() {
    if (this.value.match('[^0-9]')) {
        this.value = this.value.substring(0, this.value.length - 1);
    }
}
function isNeedNewRow() {
    if (this.value) {
        deleteOnChangeAttribute(this);
        deleteGreenRows();
        createNewRow();
    }
}

function deleteOnChangeAttribute(input) {
    let row = input.parentNode.parentNode.querySelectorAll('td');
    row.forEach(cell => {
        cell.querySelector('input').removeAttribute("onchange");
    });
}

function createNewRow() {
    let table = document.querySelector('table'),
        row = table.insertRow();
    for (let i = 0; i < 3; i++) {
        let cell = row.insertCell(),
            input = document.createElement("input");
        input.setAttribute('type', 'text');
        input.setAttribute('onchange', 'isNeedNewRow.apply(this)');
        if (i < 2) {
            input.setAttribute('maxlength', '10');
        } else {
            input.setAttribute('oninput', 'isValidNumber.apply(this)');
        }
        cell.appendChild(input);

    }
}

function deleteGreenRows() {
    rows = document.querySelectorAll('[green]');
    rows.forEach(row => {
        row.parentNode.removeChild(row);
    })
}

function colorRedRows() {
    cells = document.querySelectorAll('[red]');
    cells.forEach(cell => {
        cell.style.backgroundColor = "";
    });
}

function isValidRow(row) {
    let validCellCount = 0;
    row.forEach(cell => {
        if (cell.querySelector('input').value) {
            validCellCount++;
        }
    });

    if (validCellCount === 3) {

        return true;
    } else  if ((3 > validCellCount) && (validCellCount > 0)) {
        row.forEach(cell => {
            cell.style.backgroundColor = "red";
            cell.setAttribute('red', 'true');
        });
        alert('Не все строки заполнены полностью. Рассчёты будут произведены без учёта этих строк');
    }

    return false;
}

function preparation() {
    let table = document.querySelector('table'), transactions = [];
    deleteGreenRows();
    colorRedRows();
    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i].querySelectorAll('td');

        if (isValidRow(row)) {
            transactions.push([row[0].querySelector('input').value, row[1].querySelector('input').value, row[2].querySelector('input').value]);
        }

    }

    return transactions;
}

function processing(transactions) {
    let temp = [], subjects = [], finalTransactions = [];
    transactions.forEach(trans => {
        temp[trans[0]] = (temp[trans[0]] ? Number(temp[trans[0]]) : 0) - Number(trans[2]);
        temp[trans[1]] = (temp[trans[1]] ? Number(temp[trans[1]]) : 0) + Number(trans[2]);
    });

    let keys = Object.keys(temp);

    keys.sort(function(a,b){return temp[a]- temp[b]});
    keys.forEach(key => {
        subjects[key] = temp[key];
    });

    do {
        for (let i = 0; i < keys.length; i++) {
            let k = keys.length - 1 - i;
            if (i >= k) {
                if (keys.length === 1 && subjects[keys[i]] === 0) {
                    delete subjects[keys[i]];
                    keys.splice(i, 1);
                }
                break;
            }

            if (subjects[keys[k]] + subjects[keys[i]] > 0) {

                finalTransactions.push([keys[i], keys[k], subjects[keys[i]]  * (-1)]);
                subjects[keys[k]] = subjects[keys[k]] + subjects[keys[i]];

                delete subjects[keys[i]];
                keys.splice(i, 1);

            } else if (subjects[keys[k]] + subjects[keys[i]] === 0) {

                if (subjects[keys[i]] !== 0) {
                    finalTransactions.push([keys[i], keys[k], subjects[keys[k]]]);
                }

                delete subjects[keys[i]];
                keys.splice(i, 1);
                delete subjects[keys[k - 1]];
                keys.splice(k - 1, 1);

            } else {

                finalTransactions.push([keys[i], keys[k], subjects[keys[k]]]);
                subjects[keys[i]] = subjects[keys[k]] + subjects[keys[i]];

                delete subjects[keys[k]];
                keys.splice(k, 1);

            }

        }

    } while (keys.length !== 0);

    return finalTransactions;
}

function rendering(finalTransactions) {

    if (finalTransactions.length === 0) {
        alert('Никто никому ничего не должен');

        return true;
    }

    let table = document.querySelector('table');
    finalTransactions.forEach(trans => {
        let row = table.insertRow();
        row.setAttribute('green', 'true');
        for (let i = 0; i < trans.length; i++) {
            let cell = row.insertCell(),
                text = document.createTextNode(trans[i]);
            cell.appendChild(text);
            cell.style.backgroundColor = "green";
        }
    });
}

function cut() {
    let transactions = preparation(),
        finalTransactions = processing(transactions);
    rendering(finalTransactions);
}
