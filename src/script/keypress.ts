export function handleKeyPress(this: any, event: KeyboardEvent): void {
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
