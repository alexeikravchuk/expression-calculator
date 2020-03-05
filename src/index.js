function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    expr = expr.replace(/[\s]/g, "");

    //проверка валидности строки
    checkLine(expr);
    
    let result = expr.split("");

    // в каждом цикле выполняется операции внутри скобок пока не получим число
    while (typeof result != "number") {
        result = nextOperation(result);
    }
    return Number(result);
}

function checkLine(expr) {
    //проверка количества открытых и закрытых скобок
    if (expr.replace(/[\d\s\\\+\*\-\(]/g, "").length  != expr.replace(/[\d\s\\\+\*\-\)]/g, "").length) {
        throw Error("ExpressionError: Brackets must be paired")
    }

    //проверка деления на 0
    if ( expr.includes("/0") ) {
        throw new Error("TypeError: Division by zero.");
    }
}

function nextOperation(expr) {
  let start = undefined;
  let end = expr.length - 1;
    //ищем открывающую скобку, затем закрывающую и высчитываем результат внутри скобок, вовращаем полученный массив
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] == '(') start = i;
      else if (start != undefined && expr[i] == ')') {
        end = i;
        let expression = expr.splice(start + 1, end - start - 1);
        expr[start] = calculate(expression);
        expr.splice(start + 1, 1);
        return expr;
      }
    }

    //если скобок не нашли, высчитываем результат и возвращаем его
    return calculate(expr);   
}

function calculate(expr) {

    //арифметические операции
    const methods = {
        "+" : (a, b) => a + b,
        "-" : (a, b) => a - b,
        "*" : (a, b) => a * b,
        "/" : (a, b) => a / b
    }

    function calc(operation1, operation2){

        let leftN = '';
        let rightN = '';
        let operation = '';
        let startIndex = 0;

        //цикл перебирает массив элементо в поиске левого и правого операнда и оператор
        //высчитывается результат, заменяется последний учавствующий элемент, лишнее удаляется
        for (let i = 0; i <= expr.length; i++) {
            if (!operation) {
              if (expr[i] == operation1 || expr[i] == operation2) {
                operation = expr[i];
              } else {
                if(!isNaN(+expr[i])) {  //если не символ, то добавляем следующую цифру
                  leftN += expr[i];
                } else {
                  leftN = '';
                  startIndex = i + 1;
                }
              }
            } else {
              if(!isNaN(+expr[i])) {        //если не символ, то добавляем следующую цифру
                rightN += expr[i];
              } else {
                expr[i - 1] = methods[operation](+leftN, +rightN);
                expr.splice(startIndex, i - 1 - startIndex);
                i = startIndex - 1;
                startIndex = i + 1;
                leftN = '';
                rightN = '';
                operation = '';
              }
            }
        }
    }

    calc("*", "/"); //сначала выполняются по-порядку операции умножения и деления
    calc("+", "-"); //затем сумма и вычитание

    return +expr[0];
}

module.exports = {
    expressionCalculator
}