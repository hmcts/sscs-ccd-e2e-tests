export class DwpOffice {
    officeMap = new Map([
        ['ESA', 'Sheffield DRT'],
        ['PIP', '3'],
        ['UC', 'Universal Credit']
    ]);

    officeCode(benefit_code) {
        return this.officeMap.get(benefit_code);
    }
}
