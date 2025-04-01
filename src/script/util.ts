export interface ExtendedMath extends Math {
    sindeg: (x: number) => number;
    cosdeg: (x: number) => number;
    tandeg: (x: number) => number;
    asindeg: (x: number) => number;
    acosdeg: (x: number) => number;
    atandeg: (x: number) => number;
}
