import { LightningElement, wire, api, track } from 'lwc';
import festivalQuerier from '@salesforce/apex/festivalAddressGetter.festivalQuerier';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FestivalMC from '@salesforce/messageChannel/FestivalMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class FestivalMap extends LightningElement {
    @track selectedMarkerValue;
    @track mapMarkerArray = []; 
    @track displayedMarkers = [];
    @track error;
    @api selectedFestival;
    openModal = false;
    results;
    recordName;
    statusPick = 'ALL';

    @wire(MessageContext)
    messageContext; 

    get options () {
        return [
        { value: 'ALL', label: 'All'},
        { value: 'Planning', label: 'Planning'},
        { value: 'Recruiting Acts', label: 'Recruiting Acts'},
        { value: 'Booked', label: 'Booked'},
        { value: 'Upcoming', label: 'Upcoming'},
        { value: 'In Progress', label: 'In Progress'},
        { value: 'Completed', label: 'Completed'},
        { value: 'Cancelled', label: 'Cancelled'}
        ];
    }   

    @wire(festivalQuerier, {statusCode: 'ALL'})
    wiredAccounts({error, data}) {
        console.log('   ');
        if (data) {
            this.results = data; 
            console.log('1');
            data.forEach(dataItem => {
                this.mapMarkerArray = [...this.mapMarkerArray,
                {
                    location: {
                        City: dataItem.Festival_Location__City__s,
                        Country: dataItem.Festival_Location__CountryCode__s,
                        PostalCode: dataItem.Festival_Location__PostalCode__s,
                        State: dataItem.State_Code__c,
                        Street: dataItem.Festival_Location__Street__s
                    },
                    icon: 'action:map',
                    title: dataItem.Name,
                    value: {
                        weather: dataItem.Weather_Report__c,
                        id: dataItem.Id
                    },
                    status: dataItem.Status__c,
                }
                ];
            });
            this.displayedMarkers = this.mapMarkerArray;
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }

    handleMarkerSelect(event) {
        console.log('2');
        console.log(event.detail);
        this.selectedMarkerValue = event.detail.selectedMarkerValue.Id;
        this.sendMessageService(event.detail)
        // this.openModal = true; 
    }

    sendMessageService(festival){
        console.log('3')
        console.log(festival.selectedMarkerValue.id);
        publish(this.messageContext, FestivalMC, {recordId: festival.selectedMarkerValue.id, weatherReport: festival.selectedMarkerValue.weather});
    }

    // handleSuccess(event) { 
    //     console.log('4');
    //     this.openModal = false; 
    //     this.dispatchEvent(
    //         new ShowToastEvent({
    //             title: 'Festival Updated',
    //             message: 'Festival Updated', 
    //             variant: 'success'
    //         })
    //     );
        
    //     this.updateFestival(event);

    // }

    // closeModal() { 
    //     console.log('5');
    //     this.openModal = false; 
    // }

    // updateFestival(event) { 
    //     console.log('6');
    //     return refreshApex(this.results);
    // }

    handleChange(event) {
        console.log('7');
        this.statusPick = event.detail.value; 
        this.displayedMarkers = [];
        if(this.statusPick === 'ALL'){
            this.displayedMarkers = this.mapMarkerArray;
        } else{
            for(let i = 0; i < this.mapMarkerArray.length; i++){
                if(this.statusPick === this.mapMarkerArray[i].status){
                    this.displayedMarkers.push(this.mapMarkerArray[i])
                }
            }
        }
    }
}