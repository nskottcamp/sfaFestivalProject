import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

const FIELDS = [
    'Account.Name',
    'Account.Phone',
    'Account.Description'
];

export default class FestivalCard extends NavigationMixin(LightningElement){
    @api recId; 
    
    @wire(getRecord, { recordId: '$recId', fields: FIELDS })
    account;

    get name() {
        //console.log('16')
        return this.account.data.fields.Name.value;
    }

    get phone() {
        //console.log('17')
        return this.account.data.fields.Phone.value;
    }

    get description() {
        //console.log('18')
        return this.account.data.fields.Description.value;
    }

    connectedCallback() {
        //console.log('15');
    }

    handleClick() {
        this[NavigationMixin.GenerateUrl]({ 
            type: 'standard__recordPage',
            attributes: {
               recordId: this.recId,
               actionName: 'view',
               objectApiName: 'Account'
           }
         }).then((url) => {
            window.open(url);
         });
    }


}