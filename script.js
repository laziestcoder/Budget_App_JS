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
    };

    return {
        addItem: function(type, description, value){
            var newItem, ID;
            //ID = 0;
            // ID = lastID + 1
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;


            if(type === 'exp'){
                newItem = Expense(ID, description, value);
            }else if(type === 'inc'){
                newItem = Income(ID, description, value);
            }
            data.allItems[type].push(newItem);
            return newItem; 
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

    }
    return {
        getInput: function () {
            return {
                // type: document.querySelector('.add__type').value, // will be either inc or exp
                type: document.querySelector(DOMStrings.inputType).value,
                // description: document.querySelector('.add__description').value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                //value: document.querySelector('.add__value').value
                value: document.querySelector(DOMStrings.inputValue).value
            };
            /*
            var type = document.querySelector('.add__type').value; // will be either inc or exp
            var description = document.querySelector('.add__description').value;
            var value = document.querySelector('.add__value').value;
            */
        },
        getDOMStrings: function () {
            return DOMStrings;
        }


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
    }
    //var DOMS = UICtrl.getDOMStrings(); // line 44 getDOMStrings
    var ctrlAddItem = function () {
        /*
        1. Get the field Input Data
        2. Add the item to the budget controller
        3. Add the item to the UI
        4. Calculate the budget
        5. Display the budget to the UI
        */
        //console.log("worked");

        var input = UICtrl.getInput(); // line 29 getInput
        console.log(input);

    }

    return {
        init: function () {
            //console.log("App is started !");
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
