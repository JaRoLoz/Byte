export class Timestamp {
    private timestamp: number;

    constructor(timestamp: number) {
        this.timestamp = timestamp;
    }
    
    private static secondsInAMinute = 60;
    /** @noSelf **/
    private static secondsInAnHour = 60 * Timestamp.secondsInAMinute;
    /** @noSelf **/
    private static secondsInADay = 24 * Timestamp.secondsInAnHour;
    /** @noSelf **/
    private static daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    /** @noSelf **/
    public static isLeapYear = (year: number): boolean => 
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    
    public getTimestamp = (): number => this.timestamp;
    public getSecond = (): number => this.timestamp % 60;

    public getMinute = (): number => 
        Math.floor(this.timestamp / Timestamp.secondsInAMinute) % 60;

    public getHour = (): number => 
        Math.floor(this.timestamp / Timestamp.secondsInAnHour) % 24;

    public getYear = (): number => {
        let totalDays = Math.floor(this.timestamp / Timestamp.secondsInADay);
        let year = 1970;

        while (true) {
            const daysInYear = Timestamp.isLeapYear(year) ? 366 : 365;
            if (totalDays < daysInYear) break;
            totalDays -= daysInYear;
            year++;
        }

        return year;
    };

    public getMonth = (): number => {
        let totalDays = Math.floor(this.timestamp / Timestamp.secondsInADay);
        let year = 1970;

        while (true) {
            const daysInYear = Timestamp.isLeapYear(year) ? 366 : 365;
            if (totalDays < daysInYear) break;
            totalDays -= daysInYear;
            year++;
        }

        const daysPerMonth = [...Timestamp.daysPerMonth];
        if (Timestamp.isLeapYear(year)) daysPerMonth[1] = 29; // Adjust February for leap years

        let month = 0;
        while (totalDays >= daysPerMonth[month]) {
            totalDays -= daysPerMonth[month];
            month++;
        }

        return month + 1; // Months are 1-based
    };

    public getDay = (): number => {
        let totalDays = Math.floor(this.timestamp / Timestamp.secondsInADay);
        let year = 1970;

        while (true) {
            const daysInYear = Timestamp.isLeapYear(year) ? 366 : 365;
            if (totalDays < daysInYear) break;
            totalDays -= daysInYear;
            year++;
        }

        const daysPerMonth = [...Timestamp.daysPerMonth];
        if (Timestamp.isLeapYear(year)) daysPerMonth[1] = 29; // Adjust February for leap years

        for (let month = 0; month < 12; month++) {
            if (totalDays < daysPerMonth[month]) break;
            totalDays -= daysPerMonth[month];
        }

        return totalDays + 1; // Days are 1-based
    };
};
