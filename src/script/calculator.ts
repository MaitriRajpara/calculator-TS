import { saveHistory } from './history';
import { handleMC, handleMR, handleMS, handleMplusAndMinus } from './memory';

export class Calculator {
    screen: HTMLElement;
    calculationDone: boolean;
    isDegreeMode: boolean;
    isPrimary: boolean;
    FEMode: boolean;
    FEButton: HTMLElement;
    sinBtn: HTMLElement;
    cosBtn: HTMLElement;
    tanBtn: HTMLElement;
    isSecondPrimary: boolean;

    constructor(screenId: string) {
        this.screen = document.getElementById(screenId) as HTMLElement;
        if (!this.screen) {
            throw new Error(`Screen element with id "${screenId}" not found.`);
        }
        this.calculationDone = false;
        this.screen.textContent =
            localStorage.getItem('calculationOutput') || '0';
        this.isDegreeMode = true;
        this.updateDegButton();
        this.isPrimary = false;
        this.FEMode = false;
        this.handleKeyPress = this.handleKeyPress.bind(this);

        // Constants for buttons
        const FEButton = document.getElementById('fe-btn') as HTMLElement;
        const sinBtn = document.querySelector('.sin-btn') as HTMLElement;
        const cosBtn = document.querySelector('.cos-btn') as HTMLElement;
        const tanBtn = document.querySelector('.tan-btn') as HTMLElement;

        if (!FEButton) {
            console.error('F-E Button not found!');
        }

        this.FEButton = FEButton;
        this.sinBtn = sinBtn;
        this.cosBtn = cosBtn;
        this.tanBtn = tanBtn;
    }

    public handleKeyPress(this: Calculator, event: KeyboardEvent): void {
        const key: string = event.key;

        if (!isNaN(Number(key))) {
            this.appendValue(key);
        } else if (key === '+') {
            this.add();
        } else if (key === '-') {
            this.subtract();
        } else if (key === '*') {
            this.multiply();
        } else if (key === '/') {
            this.divide();
        } else if (key === 'Enter') {
            this.result();
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            this.clearDisplay();
        }
    }

    appendValue(value: string): void {
        const currentText = this.screen.textContent || '';
        const operators = ['+', '-', '×', '÷', '.', '!', '%'];
        const lastChar = currentText.slice(-1);

        // Check if the input exceeds the 20 character limit
        if (currentText.length >= 20) {
            alert('Cannot exceed more than 20 input values');
            return;
        }

        if (this.calculationDone) {
            this.screen.textContent = '';
            this.calculationDone = false;
        }

        if (operators.includes(lastChar) && operators.includes(value)) {
            return;
        }

        if (
            value === '.' &&
            (lastChar === '.' ||
                currentText
                    .split(/[\+\-\*\%\!/]/)
                    .pop()
                    ?.includes('.'))
        ) {
            alert('Cannot enter multiple decimal values');
            return;
        }

        if (this.screen.textContent === '0' && !operators.includes(value)) {
            this.screen.textContent = value;
        } else {
            this.screen.textContent += value;
        }
        this.screen.scrollTo(this.screen.offsetWidth, 0);
    }

    initializeMemoryFunctions(): void {
        // Constants for memory function buttons
        const mcBtn = document.querySelector('.mc-btn') as HTMLElement;
        const mrBtn = document.querySelector('.mr-btn') as HTMLElement;
        const msBtn = document.querySelector('.ms-btn') as HTMLElement;
        const mplusBtn = document.querySelector('.mplus-btn') as HTMLElement;
        const mminusBtn = document.querySelector('.mminus-btn') as HTMLElement;

        mcBtn.addEventListener('click', () => handleMC());
        mrBtn.addEventListener('click', () => handleMR(this.screen));
        msBtn.addEventListener('click', () =>
            handleMS(this.screen, (input) => input.textContent)
        );
        mplusBtn.addEventListener('click', (event) =>
            handleMplusAndMinus(
                event.target,
                this.screen,
                (input) => input.textContent
            )
        );
        mminusBtn.addEventListener('click', (event) =>
            handleMplusAndMinus(
                event.target,
                this.screen,
                (input) => input.textContent
            )
        );
    }

    add(): void {
        this.appendValue('+');
    }

    subtract(): void {
        this.appendValue('-');
    }

    multiply(): void {
        this.appendValue('×');
    }

    divide(): void {
        this.appendValue('÷');
    }

    addOpenParenthesis(): void {
        this.appendValue('(');
    }

    addCloseParenthesis(): void {
        this.appendValue(')');
    }

    backspace(): void {
        let currentValue = this.screen.textContent || '';
        this.screen.textContent = currentValue.slice(0, -1) || '0';
    }

    clearDisplay(): void {
        this.screen.textContent = '0';
    }

    tenPowerX(): void {
        this.appendValue('10^');
    }

    xpowery(): void {
        if (!this.screen.textContent?.includes('^')) {
            this.appendValue('^');
        }
    }

    square(): void {
        if (!this.screen.textContent?.includes('^')) {
            this.appendValue('^2');
        }
    }

    sqrt(): void {
        this.appendValue('sqrt(');
    }

    log(): void {
        this.screen.textContent = 'log(';
    }

    ln(): void {
        this.screen.textContent = 'ln(';
    }

    absoluteValue(): void {
        this.appendValue('abs(');
    }

    factorial(n: number): number {
        if (n === 0 || n === 1) return 1;
        return n * this.factorial(n - 1);
    }

    result(): void {
        let expression = this.screen.textContent || '';
        expression = expression
            .replace('×', '*')
            .replace('÷', '/')
            .replace('%', '%')
            .replace(/π/g, 'Math.PI')
            .replace('10^', '10**')
            .replace('^', '**')
            .replace('log', 'Math.log10')
            .replace('ln', 'Math.log')
            .replace('abs', 'Math.abs')
            .replace(/\be\b/g, 'Math.E')
            .replace('sqrt', 'Math.sqrt')
            .replace(/\bfloor\(/g, 'Math.floor(')
            .replace(/(\d+)!/g, 'this.factorial($1)')
            .replace(/\bceil\(/g, 'Math.ceil(');

        if (!this.isDegreeMode) {
            expression = expression
                .replace('sin', 'Math.sin')
                .replace('cos', 'Math.cos')
                .replace('tan', 'Math.tan')
                .replace('asin', 'Math.asin')
                .replace('acos', 'Math.acos')
                .replace('atan', 'Math.atan');
        } else {
            Math.sindeg = (x: number) => Math.sin((Math.PI / 180) * x);
            Math.cosdeg = (x: number) => Math.cos((Math.PI / 180) * x);
            Math.tandeg = (x: number) => Math.tan((Math.PI / 180) * x);
            expression = expression.replace(/\bsin\(/g, 'Math.sindeg(');
            expression = expression.replace(/\bcos\(/g, 'Math.cosdeg(');
            expression = expression.replace(/\btan\(/g, 'Math.tandeg(');

            Math.asindeg = (x: number) => (180 / Math.PI) * Math.asin(x);
            Math.acosdeg = (x: number) => (180 / Math.PI) * Math.acos(x);
            Math.atandeg = (x: number) => (180 / Math.PI) * Math.atan(x);
            expression = expression.replace(/\basin\(/g, 'Math.asin(');
            expression = expression.replace(/\bacos\(/g, 'Math.acos(');
            expression = expression.replace(/\batan\(/g, 'Math.atan(');
        }

        try {
            const evaluatedResult = eval(expression);
            this.screen.textContent = evaluatedResult.toString();
            this.calculationDone = true;
            saveHistory(`${expression} = ${evaluatedResult}`);
        } catch (error) {
            alert('Error');
        }
    }

    appendPi(): void {
        const piSymbol = 'π';
        if (this.screen.textContent === '0') {
            this.appendValue(piSymbol);
        } else {
            this.appendValue(`${piSymbol}`);
        }
    }

    reciprocal(): void {
        let currentInput = this.screen.textContent || '';
        if (currentInput === '0') {
            this.screen.textContent = '1/';
            return;
        }
        this.screen.textContent = currentInput.concat('1/');
    }

    setupDropdown(btnId: string, menuId: string): void {
        const dropdownBtn = document.getElementById(btnId) as HTMLElement;
        const dropdownMenu = document.getElementById(menuId) as HTMLElement;

        if (!dropdownBtn || !dropdownMenu) {
            console.error('Dropdown button or menu not found!');
            return;
        }

        dropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.style.display =
                dropdownMenu.style.display === 'block' ? 'none' : 'block'; // Toggle visibility
        });

        document.addEventListener('click', () => {
            dropdownMenu.style.display = 'none';
        });

        dropdownMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    Femode(): void {
        const isFeMode = this.FEMode;
        this.FEButton = document.getElementById('fe-btn') as HTMLButtonElement;
        this.FEMode = !isFeMode;
        this.FEButton.ariaLabel = this.FEMode
            ? 'Scientific Notation Mode'
            : 'Default Notation Mode';
        if (this.FEButton) {
            this.FEButton.textContent = this.FEMode ? 'ex' : 'f-e';
        }
        this.FEButton.textContent = this.FEMode ? 'E' : 'F-E';
        this.updateDisplay();
    }

    updateDisplay(): void {
        const currentValue = parseFloat(this.screen.textContent || '0');
        if (isNaN(currentValue)) {
            return;
        }

        if (this.FEMode) {
            this.screen.textContent =
                this.convertToEngineeringNotation(currentValue);
        } else {
            this.screen.textContent =
                this.convertToScientificNotation(currentValue);
        }
    }

    convertToEngineeringNotation(value: number): string {
        const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
        const exponentValue = value / Math.pow(10, exponent);
        return exponentValue.toFixed(3) + ' × 10^' + exponent;
    }

    convertToScientificNotation(value: number): string {
        const exponent = Math.floor(Math.log10(Math.abs(value)));
        const exponentValue = value / Math.pow(10, exponent);
        return exponentValue.toFixed(3) + ' × 10^' + exponent;
    }

    toggleSign(): void {
        const currentValue = parseFloat(this.screen.textContent || '0');
        if (isNaN(currentValue)) {
            this.screen.textContent = 'Error';
        } else {
            this.screen.textContent = (currentValue * -1).toString();
        }
    }

    eulersFormula(): void {
        const x = parseFloat(this.screen.textContent || '0');
        if (isNaN(x)) {
            this.screen.textContent = 'Error';
        } else {
            this.screen.textContent = Math.exp(x).toString();
        }
    }

    toggleSecondPrimary(button: HTMLElement) {
        this.isSecondPrimary = !this.isSecondPrimary;
        button.textContent = this.isSecondPrimary ? 'Primary' : '2nd';
        const trigFunctions = [
            { btn: this.sinBtn, primary: 'sin(', secondary: 'asin(' },
            { btn: this.cosBtn, primary: 'cos(', secondary: 'acos(' },
            { btn: this.tanBtn, primary: 'tan(', secondary: 'atan(' },
        ];

        // Update button text and event listeners
        trigFunctions.forEach(({ btn, primary, secondary }) => {
            if (btn) {
                const functionText = this.isSecondPrimary ? secondary : primary;
                btn.textContent = functionText.replace('(', '');
                const newBtn = btn.cloneNode(true) as HTMLElement;
                btn.parentNode?.replaceChild(newBtn, btn);

                // Set the new button reference
                if (btn.classList.contains('sin-btn')) this.sinBtn = newBtn;
                if (btn.classList.contains('cos-btn')) this.cosBtn = newBtn;
                if (btn.classList.contains('tan-btn')) this.tanBtn = newBtn;

                newBtn.addEventListener('click', () => {
                    this.appendValue(functionText);
                });
            }
        });
    }

    trigonometry(func: string) {
        let inputText = this.screen.textContent?.trim() || '';
        let inputMatch = inputText.match(/-?\d+(\.\d+)?/);
        let inputValue = inputMatch ? parseFloat(inputMatch[0]) : NaN;

        if (isNaN(inputValue)) {
            this.screen.textContent = 'Error';
            return;
        }

        let result: number;

        switch (func) {
            case 'asin':
                if (inputValue < -1 || inputValue > 1) {
                    this.screen.textContent = 'Error';
                    return;
                }
                result = Math.asin(inputValue);
                break;
            case 'acos':
                if (inputValue < -1 || inputValue > 1) {
                    this.screen.textContent = 'Error';
                    return;
                }
                result = Math.acos(inputValue);
                break;
            case 'atan':
                result = Math.atan(inputValue);
                break;
            case 'sin':
                result = Math.sin(
                    this.isDegreeMode
                        ? inputValue * (Math.PI / 180)
                        : inputValue
                );
                break;
            case 'cos':
                result = Math.cos(
                    this.isDegreeMode
                        ? inputValue * (Math.PI / 180)
                        : inputValue
                );
                break;
            case 'tan':
                result = Math.tan(
                    this.isDegreeMode
                        ? inputValue * (Math.PI / 180)
                        : inputValue
                );
                break;
            default:
                this.screen.textContent = 'Error';
                return;
        }

        if (this.isDegreeMode && ['asin', 'acos', 'atan'].includes(func)) {
            result = result * (180 / Math.PI);
        }

        this.screen.textContent = result.toFixed(6);
        this.saveHistory(
            `${func}(${inputValue}${this.isDegreeMode ? '°' : ' rad'}) = ${result.toFixed(6)}`
        );
    }

    setDegMode() {
        this.isDegreeMode = !this.isDegreeMode;
        this.updateDegButton();
    }

    updateDegButton() {
        const degButton = document.getElementById('deg-btn');
        if (degButton) {
            degButton.innerText = this.isDegreeMode ? 'DEG' : 'RAD';
        }
    }

    floor() {
        this.screen.textContent = 'floor(';
    }

    ceil() {
        this.screen.textContent = 'ceil(';
    }

    saveHistory(entry: string) {}
}
