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
    }
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
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"> </i> </button> </div> </div> </div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value"> %value% </div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn" > <i class="ion-ios-close-outline"></i> </button > </div > </div > </div > ';
            }

            // Replace placehlder text
            newHtml = html.replace('%id', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%', object.value);

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';

            }
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
        }
        //console.log("worked");
    };

    return {
        init: function () {
            console.log("App is started !");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
            setupEventListeners();
        }
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
