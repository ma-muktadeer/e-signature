export class InstitutionType{
     name?: string;
     value?: string;
}

export const INSTITUTION_TYPE: InstitutionType[] = [
    { value: 'SCHEDULED_BANK', name: 'Scheduled Banks' },
    { value: 'NON_BANKS', name: 'Non-Banks' },
    { value: 'EXCHANGE_HOUSE', name: 'Exchange House' },
    { value: 'OTHERS', name: 'Others' },
]