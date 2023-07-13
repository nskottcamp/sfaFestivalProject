global without sharing class ScheduledWeatherApi implements Schedulable {
    global void execute(SchedulableContext sc){
        weatherAPI.weatherCheck();
    }
}