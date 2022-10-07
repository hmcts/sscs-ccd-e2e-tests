export class NIGenerator {
    myNINumberFromDay() {
        let sDay: any,  sMinute: any, sHour: any;
        let d = new Date();
        let dd = d.getDate();
        let hh = d.getHours();
        let mm = d.getMinutes();
        if (dd < 10) { sDay = '0' + dd; } else { sDay = dd; }
        if (hh < 10) { sHour = '0' + hh; } else { sHour = hh; }
        if (mm < 10) { sMinute = '0' + mm; } else { sMinute = mm; }
        return '' + sDay + sHour + sMinute;
    }
        // NiNo validation : Neither of the first two letters can be D, F, I, Q, U or V.
        // The second letter also cannot be O. The prefixes BG, GB, NK, KN, TN, NT and ZZ are not allocated
        // Letters to avoid - B, D, F, G, I, K, N, O, Q, T, U, V, Z
    myNIMonthPrefix() {
        let d = new Date();
        let month = d.getMonth();
        switch ( month ) {
        case 0:
            return 'A'; break;
        case 1:
            return 'C'; break;
        case 2:
            return 'E'; break;
        case 3:
            return 'H'; break;
        case 4:
            return 'J'; break;
        case 5:
            return 'L'; break;
        case 6:
            return 'M'; break;
        case 7:
            return 'P'; break;
        case 8:
            return 'R'; break;
        case 9:
            return 'S'; break;
        case 10:
            return 'X'; break;
        case 11:
            return 'Y'; break;
        default:
            return 'T';
        }
    }

    myNIYearPrefix() {
        let d = new Date();
        let year = d.getFullYear();
        switch ( year ) {
        case 2020:
            return 'A'; break;
        case 2021:
            return 'C'; break;
        case 2022:
            return 'E'; break;
        case 2023:
            return'H'; break;
        case 2024:
            return 'J'; break;
        case 2025:
            return 'L'; break;
        case 2026:
            return 'M'; break;
        default:
            return 'P';
        }
    }
}
