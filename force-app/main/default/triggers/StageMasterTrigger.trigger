trigger StageMasterTrigger on Stage__c (after insert, after update) {

    if(trigger.isAfter) {
        if(trigger.isInsert) {
            StageTriggerHandler.timeSlotCreator(trigger.new);
        }

        // if(trigger.isUpdate) {
        //     StageTriggerHandler.timeSlotCreator(trigger.new);
        // } 
    }

}