export class GroupDeligation {
    name: string;
    value: string;

    static getGroupList(): GroupDeligation[] {
        return [
            { name: 'A', value: 'a' },
            { name: 'B', value: 'b' },
            { name: 'C', value: 'c' },
            { name: 'D', value: 'd' },
        ];
    }

    static getDeligationList(): GroupDeligation[] {
        return [
            { name: 'Deligation A', value: 'deligation_a' },
            { name: 'Deligation B', value: 'deligation_b' },
            { name: 'Deligation C', value: 'deligation_c' },
            { name: 'Deligation D', value: 'deligation_d' },
        ]
    }

}