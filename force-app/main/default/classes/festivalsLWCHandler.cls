public without sharing class festivalsLWCHandler {
    
    @AuraEnabled(cacheable=true) 
    public static Map<Id, List<Id>> getRelatedActs() {
        
        List<Festivals__c> festivals = new List<Festivals__c>([SELECT id FROM Festivals__c]);
        List<Performance__c> performances = new List<Performance__c>([SELECT id, Act__c, Festival__c FROM Performance__c]);
        Map<Id, List<Id>> returnMap = new Map<Id, List<Id>>(); 

        for(Festivals__c f: festivals){
            Set<Id> accountIds = new Set<Id>();
            List<Id> returnList = new List<Id>();
            for(Performance__c p: performances){
                if(p.Festival__c == f.Id){
                    accountIds.add(p.Act__c);
                }
            }
            returnList.addAll(accountIds);
            //returnList.sort();
            returnMap.put(f.id, returnList);
        }
        return returnMap; 
    }

    //currently not being used
    @AuraEnabled(cacheable=true) 
    public static List<Contact> getRelatedContacts(String recordId) {
        return [SELECT id, FirstName, LastName, Phone, Email FROM Contact WHERE AccountId = :recordId];
    }
}