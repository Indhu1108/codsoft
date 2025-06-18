document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    function inputDecimal(dot) {
        if (waitingForSecondOperand) {
            currentInput = '0.';
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes(dot)) {
            currentInput += dot;
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    const performCalculation = {
        '÷': (firstOperand, secondOperand) => {
            if (secondOperand === 0) {
                alert("Cannot divide by zero!");
                return NaN;
            }
            return firstOperand / secondOperand;
        },
        '×': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '−': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand
    };

    function handleSpecialFunction(func) {
        const inputValue = parseFloat(currentInput);
        let result;

        switch (func) {
            case '%':
                result = inputValue / 100;
                break;
            case '√':
                if (inputValue < 0) {
                    alert("Cannot calculate square root of a negative number.");
                    return;
                }
                result = Math.sqrt(inputValue);
                break;
            default:
                return;
        }
        currentInput = String(result);
        updateDisplay();
    }

    
    function clearAll() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    const buttons = document.querySelector('.buttons');
    buttons.addEventListener('click', (event) => {
        const { target } = event;

        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('operator')) {
            handleOperator(target.textContent);
            return;
        }

        if (target.id === 'decimal') {
            inputDecimal(target.textContent);
            return;
        }

        if (target.id === 'clear') {
            clearAll();
            return;
        }

        if (target.id === 'percent' || target.id === 'sqrt') {
            handleSpecialFunction(target.textContent);
            return;
        }

        inputDigit(target.textContent);
    });

    updateDisplay();
});