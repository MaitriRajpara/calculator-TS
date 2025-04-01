import {
    saveHistory,
    clearHistory,
    displayHistory,
    setupHistoryToggle,
} from './history.js';
import { handleMC, handleMR, handleMS, handleMemoryOperation } from './memory.js';
import { Calculator } from './calculator.js';
import { handleKeyPress } from './keypress';

// Ensure the calculator variable is of type Calculator
const calculator = new Calculator('screen');

// Initialize event delegation for buttons (with exception for sin, cos, tan, floor, ceil)
const initializeButtons = (): void => {
    const calculatorContainer = document.querySelector(
        '.calculator'
    ) as HTMLElement;

    calculatorContainer.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;

        // If the target is a number button
        if (target.classList.contains('num')) {
            calculator.appendValue(target.textContent?.trim() || '');
        }
        // Arithmetic operations
        else if (target.classList.contains('add-btn')) {
            calculator.add();
        } else if (target.classList.contains('subtract-btn')) {
            calculator.subtract();
        } else if (target.classList.contains('multiply-btn')) {
            calculator.multiply();
        } else if (target.classList.contains('divide-btn')) {
            calculator.divide();
        }
        // Parentheses
        else if (target.classList.contains('open-paren-btn')) {
            calculator.addOpenParenthesis();
        } else if (target.classList.contains('close-paren-btn')) {
            calculator.addCloseParenthesis();
        }
        // Core functions
        else if (target.id === 'equals') {
            calculator.result();
        } else if (target.id === 'backspace') {
            calculator.backspace();
        } else if (target.classList.contains('clear-btn')) {
            calculator.clearDisplay();
        } else if (target.classList.contains('pi-btn')) {
            calculator.appendPi();
        }
        // History functions
        else if (target.classList.contains('clear-history-btn')) {
            clearHistory();
        }
        // Advanced Functions
        else if (target.classList.contains('modulus-btn')) {
            calculator.appendValue('%');
        } else if (target.classList.contains('exponent-btn')) {
            calculator.appendValue('^');
        } else if (target.classList.contains('factorial-btn')) {
            calculator.appendValue('!');
        } else if (target.classList.contains('power-btn')) {
            calculator.xpowery();
        } else if (target.classList.contains('ten-power-btn')) {
            calculator.tenPowerX();
        } else if (target.classList.contains('toggle-sign-btn')) {
            calculator.toggleSign();
        } else if (target.classList.contains('reciprocal-btn')) {
            calculator.reciprocal();
        }
        // Math Functions
        else if (target.classList.contains('log-btn')) {
            calculator.log();
        } else if (target.classList.contains('eulars-btn')) {
            calculator.eulersFormula();
        } else if (target.classList.contains('logn-btn')) {
            calculator.ln();
        } else if (target.classList.contains('abs-btn')) {
            calculator.absoluteValue();
        } else if (target.classList.contains('square-btn')) {
            calculator.square();
        } else if (target.classList.contains('sqrt-btn')) {
            calculator.sqrt();
        } else if (target.classList.contains('second-btn')) {
            calculator.toggleSecondPrimary(target);
        }
        // Degree functions
        else if (target.classList.contains('fe-btn')) {
            calculator.Femode();
        } else if (target.id === 'deg-btn') {
            if (typeof calculator !== 'undefined' && calculator.setDegMode) {
                calculator.setDegMode();
            }
        }
    });

    // Math functions: sin, cos, tan
    document.querySelector('.sin-btn')?.addEventListener('click', () => {
        calculator.appendValue('sin(');
    });

    document.querySelector('.cos-btn')?.addEventListener('click', () => {
        calculator.appendValue('cos(');
    });

    document.querySelector('.tan-btn')?.addEventListener('click', () => {
        calculator.appendValue('tan(');
    });

    // Floor and ceil
    document
        .querySelector('.floor-btn')
        ?.addEventListener('click', () => calculator.floor());
    document
        .querySelector('.ceil-btn')
        ?.addEventListener('click', () => calculator.ceil());
};

// initialize buttons
initializeButtons();
calculator.setupDropdown('dropdownBtn', 'dropdownMenu');
calculator.setupDropdown('dropdownBtn1', 'dropdownMenu1');
setupHistoryToggle();
calculator.initializeMemoryFunctions();
document.addEventListener('keydown', handleKeyPress.bind(calculator));
