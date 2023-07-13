# Salesforce Academy Developer: Festival Project

This is a project I completed during my 8 week Salesforce Developer Academy while at Booz Allen Hamilton. The point of the project was to practice the concepts that we were learning in class and put them into a practical application. 

The context of the project was to create a Salesforce Org that could be used to help a company which managed music festivals. A lot of the standard Salesforce setup was completed, but there is one LWC in specific I'd like to focus on, as it was the culmination of a lot of work and different concepts that we learned. 

### Overall Schema: 

<img width="444" alt="image" src="https://github.com/nskottcamp/sfaFestivalProject/assets/78466195/4630d602-3106-417f-9cd3-690fd3d26954">

### Build Goals

- Build a functional data model that would allow for the recording of multiple festivals with lots of performances at specifc times/places.
- Make pages smart - make an org suitable for a small team, make data dense but easy to read, use LWCs to show cross object information in one place.
- Utilize Apex and LWCs together to sharpen my skills.
- Create components that could be used for multiple objects and are versatile. 

## Apex Classes:
**Scheduled Weather API** - this is an Apex class which implements the Scheduledable interface. This can be called from the UI or anonymous apex to start the scheduled running on the 
  ScheduledWeatherApi.cls
  ScheduledWeatherApi.cls-meta.xml

**Weather API** - this is the apex class/method that make the actual callout to the Weather API (https://www.weather.gov/documentation/services-web-api#/ using the GET /alerts/active/area/{area}) it makes the callout - queries the festivals and then iterates over the festivals, checking if the location of the festival matches up with any of the 'areaDesc' properties in the feature list. If it does - it adds that weather alert to the fieldValue variable and keeps going. This way fiedlValue can contain multiple weather alerts. At the end it uses a DML operation to write that fieldValue to the corresponding festival. 
  weatherAPI.cls
  weatherAPI.cls-meta.xml

**Festival Address Getter** - This apex Class/method handles grabbing the location and some other information for each of the current festivals - this class is called into the FestivalMap lwc via an apex wire. 
  festivalAddressGetter.cls
  festivalAddressGetter.cls-meta.xml

**Festival LWC Handler** - This class helps to get info for another LWC in this repo, the RelatedListComp lwc. There is some limitations posed by both the data model I chose and the @AuraEnabled tab which is required for apex classes that work with Lightning web components. I wanted this class to return a unique list of accounts which has performances at each festival - given that some accounts have multiple performances at some festivlas.

To accomplish this while only returning primitives or collections of primitives - I made the return type Map<Id, List<Id>>, where the key is festival ID and the list is the accounts. 
  festivalsLWCHandler.cls
  festivalsLWCHandler.cls-meta.xml

## Lightning Web Components

**Festival Map** - this component displays a map, which is populated with pins representing each festival. These geolocations are fed into this via the festivalAddressGetter. These festivals can be filtered by status using a combobox and each festival can be clicked to send out a message channel to the page with the selected festival's id. 
  festivalMap.html
  festivalMap.js
  festivalMap.js-meta.xml

**Related List Comp** - This component lives on the same page as the Festival Map and relies on getting a festival id fed to it via a message channel. Once a festival id is received this component will show the latest weather report (Via the weatherAPI) and that festivals acts (Accounts/bands within the context). 
  relatedListComp.html
  relatedListComp.js
  relatedListComp.js-meta.xml

Performance Card - this is a child component of the Related List Comp - it shows each act in a lightning card. 
  performanceCard.html
  performance.js
  performance.js-meta.xml





