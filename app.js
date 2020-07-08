// Budgety App

//BUDGET CONTROLLER
var budgetController= (function(){
    
    class Expense {
        constructor(id, desc, value) {
            this.id = id;
            this.desc = desc;
            this.value = value;
            this.percentage = -1;
        }
        calcP(totalIncome) {

            if (totalIncome > 0)
                this.percentage = Math.round(this.value / totalIncome * 100);
            else
                this.percentage = -1;
        }
        getPercentage() {
            return this.percentage;
        }
    }



    class Income {
        constructor(id, desc, value) {
            this.id = id;
            this.desc = desc;
            this.value = value;
        }
    }
    
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        Total:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
        };
        
      
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(current){
            sum=sum+current.value;
        });
        data.Total[type]=sum;
    };    
        
        return{
            addItem: function(type,des,val){
                var newItem,ID;

                // Create New Id
                if (data.allItems[type].length > 0) {
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                } else {
                    ID = 0;
                }

                // Create new Item
                if(type==='exp')
                   newItem = new Expense(ID,des,val);
                else if(type==='inc')
                    newItem = new Income(ID,des,val);
                
                // Push into respective ds
                data.allItems[type].push(newItem);  
                return newItem;  
            },

            deleteItem:function(type,id){
                
                var ids,index=-1;

                ids= data.allItems[type].map(function(current){
                    return current.id;
                });

                index=ids.indexOf(id);

                if(index!==-1){
                    data.allItems[type].splice(index,1);
                }

            },

            calculateBudget:function(){

                //calculate Income and Expenses
                calculateTotal('exp');
                calculateTotal('inc');
                //Calculate the budget
                data.budget=data.Total.inc-data.Total.exp;
                // calculate the % expense
                if(data.Total.inc>0)
                data.percentage=Math.round((data.Total.exp/data.Total.inc)*100);
                else
                data.percentage=-1;
               
            },
            calulatePercentage:function(){
                data.allItems.exp.forEach(function(current){
                    current.calcP(data.Total.inc);
                });
            },

            getPercentages:function(){
                var allPer=data.allItems.exp.map(function(current){
                    return current.getPercentage();
                });
                return allPer;
            },
            getBudget:function()
            {
                return{
                    budget: data.budget,
                    totalInc:data.Total.inc,
                    totalExp:data.Total.exp,
                    percentage:data.percentage                  
                };
            },
            testing:function(){
                return data;
            }
        };
})();


//UI CONTROLLER
var UIController=(function(){

    var DOM={
        inputType:'.add__type',
        inputDesc:'.add__description',
        inputVal:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expPercentages:'.item__percentage',
        dateLabel:'.budget__title--month'
        
    };

   var formatNumber=function(num,type){
        var sign=''; 
        var newNum;
        num=Math.abs(parseFloat(num.toFixed(2)));
         newNum=new Number(num).toLocaleString("en-IN");
         if(type!=='')
        type==='inc'?sign='+':sign='-';

        return (sign+' '+newNum);
    };

   
    return {
        getinput: function(){
            return {
                 type: document.querySelector(DOM.inputType).value,
             description:document.querySelector(DOM.inputDesc).value,
             value:parseFloat(document.querySelector(DOM.inputVal).value)
            };
            
        },

        addListTtem: function(obj,type){
            var html,newHtml,element;
            // Create HTML with placeholder texts
            if(type==='inc'){
                element=DOM.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp')
            {
                element=DOM.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } 
                      
            // Replace placeholder
           
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.desc);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
          
            // Insert HTMl
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem: function(id){

            var element=document.getElementById(id);
           element.parentNode.removeChild(element);
        },
        clearFields:function(){
            var fields,fieldsArray;
            fields=document.querySelectorAll(DOM.inputDesc+','+DOM.inputVal);
            
            fieldsArray =Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current,index,array){
                current.value="";                               
            });
            fieldsArray[0].focus();
        },

        displayBudget: function(obj){

            var type='';
            if(obj.budget>0)
            type='inc';
            else if(obj.budget<0)
            type='exp';

            document.querySelector(DOM.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOM.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOM.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
           
            if(obj.percentage>0)
            document.querySelector(DOM.percentageLabel).textContent=obj.percentage+'%';
            else
            document.querySelector(DOM.percentageLabel).textContent='---';
           
        },

        displayPercentage:function(percentages){
            var fields;
            fields=document.querySelectorAll(DOM.expPercentages);

            for(var i=0;i<fields.length;i++)
            {
                if(percentages[i]>0)
                fields[i].textContent=percentages[i]+'%';
                else
                fields[i].textContent='---';
            }

       },
       displaydate:function(){
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var now=new Date();
        var year=now.getFullYear();
        var month=now.getMonth();
        document.querySelector(DOM.dateLabel).textContent=months[month]+' '+year;
        
       },
       changeType:function(){
        var fields=document.querySelectorAll(
            DOM.inputType+','+DOM.inputDesc+','+DOM.inputVal
        );
        for(var i=0;i<fields.length;i++)
        {
            fields[i].classList.toggle('red-focus');
        }
        document.querySelector(DOM.inputBtn).classList.toggle('red');

       },

        getDOM: function(){
            return DOM;
        }
    };

})();

//APP CONTROLLER
var controller=(function(B_control,UI_control){

    var DOM=UI_control.getDOM();
    var setup=function(){

        document.querySelector(DOM.inputBtn).addEventListener('click',controlAddItem);

        document.addEventListener('keypress',function(event){
          if(event.keyCode===13 || event.which===13){
            controlAddItem();        
          }
        });
        document.querySelector(DOM.container).addEventListener('click',controlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UI_control.changeType);
    };
    
    var updateBudget=function(){

        var budget;
         // Calculate Budget;
        B_control.calculateBudget();
         //Return Budget
        budget=B_control.getBudget();       
       // Display the budget;
       UI_control.displayBudget(budget);

    };

    var updatepercentage=function(){
        
        // Calculate percentages
        B_control.calulatePercentage();
        // Read from Budget controller
        var percent=B_control.getPercentages();
       
        // Display to user interface
        UI_control.displayPercentage(percent);
    };

    var controlAddItem=function(){

        var input,newItem;
         
       // Get input data;
       input=UI_control.getinput();
        if(input.description!=="" && !isNaN(input.value) && input.value>0)
        {
             // Add item to the controller;
       newItem=B_control.addItem(input.type,input.description,input.value);
       
       // Add iten to UI;
        UI_control.addListTtem(newItem,input.type);
        // Clear fields
        UI_control.clearFields();      
       // Calculate and update budget
       updateBudget();
       updatepercentage();
        }
      
    };

    var controlDeleteItem=function(event){
        var itemId,splitId,type,id;
        itemId=(event.target.parentNode.parentNode.parentNode.parentNode.id);
        if(itemId){
            splitId=itemId.split('-');
            type=splitId[0];
            id=parseInt(splitId[1]);
            
            // Delete Item from data Structure
            B_control.deleteItem(type,id);
            //Delete the item from the user interface
           UI_control.deleteListItem(itemId); 
            //Update and show the new budget
             updateBudget();
             updatepercentage();
        }
    };

    return{
        init:function(){
            console.log('start');
            UI_control.displaydate();
            UI_control.displayBudget( {
                budget: 0,
                totalInc:0,
                totalExp:0,
                percentage:-1                  
            });
            setup();
                }
             
                
    };
   

})(budgetController,UIController);

controller.init();






