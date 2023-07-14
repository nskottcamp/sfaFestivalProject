import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from '@salesforce/apex/festivalsLWCHandler.getAccounts';
// const FIELDS = [
//     'Account.Name',
//     'Account.Phone',
//     'Account.Description'
// ];

export default class FestivalCard extends NavigationMixin(LightningElement){
    @api recId; 
    accountResults;
    accountRecords;
    accountErrors;
    wireApexResultsActs;

    @wire(getAccounts, {recordId: '$recId'})
    wiredActs(accountResults) {
        console.log('20')
        this.wireApexResultsActs = accountResults;
        if(accountResults.data){
            console.log('21')
            this.accountRecords = accountResults.data;
            this.accountErrors = undefined;
        }
        if(accountResults.error){
            this.accountRecords = undefined;
            this.accountErrors = accountResults.error;
        }
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

    // @wire(getRecord, { recordId: '$recId', fields: FIELDS, optionalFields: FIELDS })
    // account;

    // get name() {
    //     console.log('16')
    //     return this.account.data.fields.Name.value;
    // }

    // get phone() {
    //     console.log('17')
    //     return this.account.data.fields.Phone.value;
    // }

    // get description() {
    //     console.log('18')
    //     return this.account.data.fields.Description.value;
    // }

    connectedCallback() {
        console.log('15');
    }

    renderCallBack() {
        console.log('19');
    }


}