public without sharing class festivalAddressGetter {
    @AuraEnabled(cacheable=true) public static List<Festivals__c> festivalQuerier(String statusCode) {
        System.debug('apex class for festivalmap');
        List<Festivals__c> f = new List<Festivals__c>(); 
        if(statusCode == 'ALL'){
            return [SELECT id, Status__c, Name, Festival_Location__Street__s, 
                Festival_Location__City__s, Festival_Location__PostalCode__s, 
                State_Code__c, Festival_Location__CountryCode__s, Weather_Report__c FROM Festivals__c];
        } else {
            return [SELECT id, Status__c, Name, Festival_Location__Street__s, 
                Festival_Location__City__s, Festival_Location__PostalCode__s, 
                State_Code__c, Festival_Location__CountryCode__s, Weather_Report__c FROM Festivals__c WHERE Status__c = :statusCode];
        }
    }
}