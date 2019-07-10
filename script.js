// BUDGET CONTROLLER

var budgetController = (function () {
    /*var x = 23;
    var add = function(a){
        return x + a;
    }

    return {
        publicTest: function(b){
            return add(b);
        }
    }*/
    var Expense = function (id, description, value) { /* Expense is function constructor that's why 
        first letter E is capital*/
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;

        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) { /* Income is function constructor that's why 
    first letter I is capital*/
        this.id = id;
        this.description = description;
        this.value = value;
    };
    /*
        var allExpeneses = [];
        var allIncomes = [];
        var totalExpense = 0 ;
    */
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum = sum + curr.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        /*
            allExpeneses : [],
            allIncomes : [],
            totalExpense : 0 ,
        */
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: function (type, description, value) {
            var newItem, ID;
            // ID = 0;
            // ID = lastID + 1

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new Item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (curr) {
                return curr.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            // 1. summ of income
            calculateTotal('inc');

            // 2. sum of expenses
            calculateTotal('exp');

            // 3. calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // 4. calculate the percentage of income and that is spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            /* 
                expense = 100 and income of 200,
                spent 50% = 100/200 = 0.5 * 100
            */
        },

        calculatePercentages: function () {
            /*
            a=20 , b=10, c=30
            income = 100
            a = 20/100 = 20%
            b = 10%
            c = 30%
            */

            data.allItems.exp.forEach(function (c) {
                c.calcPercentages(data.totals.inc);
            });

        },

        getPercentages: function () {
            var allPercentage = data.allItems.exp.map(function (c) {
                return c.getPercentage();
            });
            return allPercentage;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },

        testing: function () {

            console.log(data);
        },
    };


})();

// UI CONTROLLER

var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',

    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec;

        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> +2,310.46
        2000 -> +2,000.00

        */

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];


        // return type + ' ' + int + dec;
        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;


    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                // type: document.querySelector('.add__type').value, // will be either inc or exp
                type: document.querySelector(DOMStrings.inputType).value,
                // description: document.querySelector('.add__description').value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                // value: document.querySelector('.add__value').value
                // value: document.querySelector(DOMStrings.inputValue).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };
            /*
            var type = document.querySelector('.add__type').value; // will be either inc or exp
            var description = document.querySelector('.add__description').value;
            var value = document.querySelector('.add__value').value;
            */
        },

        addListItem: function (object, type) {
            var html, newHtml, element;

            //Create HTML String with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"> </i> </button> </div> </div> </div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value"> %value% </div> <div class="item__percentage">%p%</div> <div class="item__delete"> <button class="item__delete--btn" > <i class="ion-ios-close-outline"></i> </button > </div > </div > </div > ';
            }

            // Replace placehlder text
            newHtml = html.replace('%id%', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%', object.value);
            newHtml = newHtml.replace('%value%', formatNumber(object.value, type));

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {
            //document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el); // pretty weired :p moja paisi
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            //fields.slice() // will not work
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();

        },

        displayBudget: function (obj) {
            var type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';

            }
        },

        displayPeprcentages: function (percentages) {
            var fields;
            fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            nodeListForEach(fields, function (curr, index) {
                if (percentages[index] > 0) {
                    curr.textContent = percentages[index] + '%';
                } else {
                    curr.textContent = '--';
                }
            });
        },


        displayDate: function () {
            var now, month, m, year;
            now = new Date();
            year = now.getFullYear();
            m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = m[month] + ' ' +year;
        },

        changeType: function(){
            var fields;

            fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(c){
                c.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
            
        },

        getDOMStrings: function () {
            return DOMStrings;
        },
    };
})();

//GLOBAL APP CONTROLLER

var controller = (function (budgetCtrl, UICtrl) {

    // some code
    /*
    // budgetController.publicTest();
    
    var z = budgetCtrl.publicTest(5);
    return {
        anotherPublic: function(){
            console.log(z);
        }
    }*/

    var setupEventListeners = function () {
        var DOMS = UICtrl.getDOMStrings(); // line 44 getDOMStrings

        document.querySelector(DOMS.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) { // 'event' or 'e' as argument
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOMS.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOMS.inputType).addEventListener('change', UICtrl.changeType);
    };
    //var DOMS = UICtrl.getDOMStrings(); // line 44 getDOMStrings

    var updateBudget = function () {
        // 1. Calculate the Budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the Budget on the UI
        //console.log(budget);
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {
        //1. calculate percentage
        budgetCtrl.calculatePercentages();

        //2. Read percentage from the controller
        var percentages = budgetCtrl.getPercentages();

        //3. update the UI with new percentage
        //console.log(percentages);
        UICtrl.displayPeprcentages(percentages);

    };
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field Input Data
        input = UICtrl.getInput(); // line 29 getInput
        // console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and Update the budget
            updateBudget();

            //6. calculate and update percentages
            updatePercentages();
        }
        //console.log("worked");
    };

    var ctrlDeleteItem = function (e) {  // 'e' means 'event'
        var itemID, splitID, type, ID;
        //console.log(e.target);
        //console.log(e.target.parentNode);
        //console.log(e.target.parentNode.parentNode.parentNode.parentNode.id);
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //'inc-0' or 'exp-1'
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3. Update and show the budget
            updateBudget();

            //4. calculate and update percentages
            updatePercentages();

        }

    };

    return {
        init: function () {
            console.log("App is started !");
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
            setupEventListeners();
        },
    };

    //document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    //document.querySelector(DOMS.inputBtn).addEventListener('click', ctrlAddItem);
    /*{

        //console.log("clicked.");
        ctrlAddItem();
    });
    */

    /* document.addEventListener('keypress', function (event) { // 'event' or 'e' as argument
         //console.log(event);
 
         if (event.keyCode === 13 || event.which === 13) {
             //console.log("Enter Key is Pressed!");
             ctrlAddItem();
 
         }
 
    });
     */
})(budgetController, UIController);

controller.init();
