export class SigViewSetupValue {
    displayName: string;
    value: string;

    static getSetupList(): SigViewSetupValue[] {
        return [
            { displayName: 'Employee ID', value: 'employeeId' },
            { displayName: 'Name', value: 'name' },
            { displayName: 'PA', value: 'pa' },
            { displayName: 'Designation', value: 'designation' },
            { displayName: 'Email', value: 'email' },
            { displayName: 'Status', value: 'signatureStatus' },
            { displayName: 'Cancel Cause', value: 'calcelCause' },
            { displayName: 'Cancel Effective Date', value: 'cancelEffectiveDate' },
            { displayName: 'Effective Date', value: 'effictiveDate' },
            // { displayName: 'Mobail Number' },
            // { displayName: 'test' },
            // { displayName: 'Name of Employee', value: 'name' },
            // { displayName: 'Designation', value: 'designation' },
            { displayName: 'Branch', value: 'baranchName' },
            // { displayName: 'Designation', value: 'designation' },
            { displayName: 'Name of Bank', value: 'institutionName' },
            { displayName: 'Delegation', value: 'deligation' },
            { displayName: 'Group', value: 'group' },

            // NOT IN THE SIGNATORY ADD OPTION. NEED TO BE ADDED
            { displayName: 'Date of Birth', value: 'birthday' }, 
            { displayName: 'Tel no', value: 'contactNumber' },
            { displayName: 'Photo', value: 'photo' }, //not found
            { displayName: 'NID', value: 'nid' }, //not found
        ];
    }

}