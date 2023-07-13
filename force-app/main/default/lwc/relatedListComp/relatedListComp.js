import { LightningElement, wire, api } from 'lwc';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import FestivalMC from '@salesforce/messageChannel/FestivalMessageChannel__c';
import getRelatedActs from '@salesforce/apex/festivalsLWCHandler.getRelatedActs';
import festivalQuerier from '@salesforce/apex/festivalAddressGetter.festivalQuerier';

export default class RelatedListComp extends LightningElement {

    //message variables and current selected festival from map component 
    @api festivalId = '';
    subscription = null;
    displayedActs = [];

    //act wire variables
    wireApexResultsActs;
    actResults;
    actRecords;
    actErrors;
    
    // //festival wire variables 
    // wireApexResultsFestival;
    // festivalResults;
    // festivalRecords;
    // festivalError;
    // selectedFestival;

    // @wire(festivalQuerier,  {statusCode: 'ALL'})
    // wiredFestivals(festivalResults) {
    //     console.log('20')
    //     this.wireApexResultsFestival = festivalResults
    //     if(festivalResults.data){
    //         console.log('21')
    //         this.festivalRecords = festivalResults.data
    //         this.festivalError = undefined
    //     }
    //     if(festivalResults.error){
    //         this.festivalRecords = undefined
    //         this.festivalError = festivalResults.error
    //     }
    // }

    // handleFestival(f) {
    //     this.selectedFestival = f;
    // }

    @wire(getRelatedActs, {})
    wiredActs(actResults) {
        console.log('10')
        this.wireApexResultsActs = actResults;
        if(actResults.data){
            console.log('11')
            this.actRecords = actResults.data;
            console.log(actResults.data);
            this.actErrors = undefined;
        }
        if(actResults.error){
            this.actRecords = undefined;
            this.actErrors = actResults.error;
        }
    }

    handleSelection (f) {
        this.displayedActs = [];
        console.log('12')
        this.displayedActs = this.actRecords[f];
        console.log(f)
        console.log(this.displayedActs)
    }

    //all the message stuff is below here 
    @wire(MessageContext)
    messageContext;

    //subscribe
    subscribeToMessageChannel() {
        console.log('13')
        if (!this.subscription) {
            this.subscription = subscribe (
                this.messageContext,
                FestivalMC,
                (message) => this.handleMessage(message),
                {scope: APPLICATION_SCOPE }
            );
        }
    }

    //handle incoming message
    handleMessage(message) {
        console.log('14')
        this.festivalId = message.recordId
        console.log(this.festivalId.selectedMarkerValue)
        this.handleSelection(this.festivalId.selectedMarkerValue); 
    }

    //unsubscribe
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    connectedCallback(){
        this.subscribeToMessageChannel();
        
    }

    disconnectedCallback(){
        this.unsubscribeFromMessageChannel();
    }
}