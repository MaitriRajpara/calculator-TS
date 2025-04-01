// memory-clear-btn
export function handleMC(): void {
    localStorage.removeItem('calculationOutput');
    console.log('Memory Cleared');
}

// memory-recall btn
export function handleMR(screen: HTMLElement): void {
    let inputvalue = screen.textContent || '';

    if (inputvalue === '0' || inputvalue === '') {
        inputvalue = '';
    }

    const memoryValue = localStorage.getItem('calculationOutput');
    if (memoryValue) {
        screen.textContent = inputvalue + memoryValue;
    } else {
        console.log('No memory value stored.');
    }
}

// memory-store-btn
export function handleMS(
    screen: HTMLElement,
    getValueCallback: (screen: HTMLElement) => string | number | null
): void {
    const valueToStore = getValueCallback(screen);
    if (valueToStore !== null && valueToStore !== undefined) {
        localStorage.setItem('calculationOutput', String(valueToStore));
        console.log(`Memory Stored: ${valueToStore}`);
    } else {
        console.error('Error storing memory: Invalid value.');
    }
}

// memory-add/minus-btn
export function handleMemoryOperation(
    operation: 'M+' | 'M-',
    screen: HTMLElement,
    getValueCallback: (screen: HTMLElement) => string | number | null
): void {
    const memoryValue = parseFloat(
        localStorage.getItem('calculationOutput') || '0'
    );
    const currentValue = parseFloat(getValueCallback(screen) as string);

    if (isNaN(memoryValue) || isNaN(currentValue)) {
        console.error('Invalid memory or current value for memory operation.');
        return;
    }

    const newMemoryValue =
        operation === 'M+'
            ? memoryValue + currentValue
            : memoryValue - currentValue;

    localStorage.setItem('calculationOutput', newMemoryValue.toString());
    console.log(
        `Memory ${operation === 'M+' ? 'Added' : 'Subtracted'}: ${newMemoryValue}`
    );
}
