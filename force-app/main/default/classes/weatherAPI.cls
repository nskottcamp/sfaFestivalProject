global without sharing class weatherAPI {
    global Map<Id, String> m1; 

    
    @future(callout=true)
    public static void weatherCheck() {

        //set url and debug
        String url = 'https://api.weather.gov/alerts/active/area/AZ';
        System.debug(url);

        //Set some variables for use throughout code
        String fieldValue = '';
        Boolean returnedAlert = false;
        Integer i = 0; 
        Map<Id, String> festString = new Map<Id, String>(); 

        //make callout 
        Http h = new Http(); 
        HttpRequest req = new HttpRequest(); 
        req.setEndpoint(url); 
        req.setMethod('GET'); 
        
        //get response and debug response, commented out because the reponse is very long. 
        HttpResponse response = h.send(req); 
        //system.debug(response); 
        // system.debug(response.getStatusCode()); 
        // system.debug(response.getStatus()); 
        //system.debug(response.getBody()); 

        //is successfull or not
        if(response.getStatusCode() == 200){
            System.debug('Success');
        } else {
            System.debug('Error: ' + response.getStatus()); 
        }

        //deserialize response, integer I for looping over featureList, 
        Map<String, Object> originalDeserializeMap = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
        List<Object> featureList = (List<Object>)originalDeserializeMap.get('features'); 

        //get festivalRecords
        List<Festivals__c> festivals = new List<Festivals__c>([SELECT County__c, id, festival_location__c, Weather_Report__c FROM Festivals__c WHERE County__c != NULL AND Festival_Location__StateCode__s != NULL]);

        //first loop through all the festivlas
        for(Festivals__c f: festivals){
            fieldValue = '';
            returnedAlert = false; 
            i = 0;
            Integer j = 1;
            for(Object o: featureList){
                Map<String, Object> loopMap1 = (Map<String, Object>)featureList[i];
                Map<String, Object> loopMap2 = (Map<String, Object>)loopMap1.get('properties');
                String loopCounty = (String)loopMap2.get('areaDesc');
                //system.debug(loopMap1); 
                if(loopCounty.contains(f.County__c)){
                    fieldValue += ('Weather Alert ' + j + ': \n \n');
                    fieldValue += (String)loopMap2.get('description');
                    fieldValue += '\n \n';
                    returnedAlert = true;
                    j++;
                }
                i++;
            }
            if(returnedAlert == false){
                festString.put(f.id, 'There is no weather alerts for this area at this time');
            } else {
                festString.put(f.id, fieldValue);
            }
            
        }
        
        for(Festivals__c f: festivals){
            f.Weather_Report__c = festString.get(f.id);   
            system.debug(f.Weather_Report__c);
        }
        update festivals;
    }

}