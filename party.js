'use strict';

const Alexa = require('alexa-sdk');

//setting up states
var states = {
    PARTYMODE: '_PARTYMODE',
    ACTIONMODE: '_ACTIONMODE',
}

//Initializing Alexa
var  startHandlers ={
    //new session of our skill
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes.eventCounter = 0;
            this.attributes.countResponse = 0;
        }
        this.handler.state = states.PARTYMODE;
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE');    
        //no reply or a reply that\'s not recognized will trigger this
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    }
}; 
//The function that controls the party listing functionality of Alexa
var partyHandlers = Alexa.CreateStateHandler(states.PARTYMODE, {
    'NewSession': function() {
         this.emit('NewSession'); //Uses the handler in startHandlers, doesn't really need to be here but can be adjusted in the future if further flexibility is needed
    },
    //Our own intent function for getting alexa to read out the party list
    'GetPartyIntent' : function() {
        var partyItem = "";
        //this array would ideally be pulled in from an outside source (e.g. using the FB API) in the future. 
        let fakedParties = [
            " Saria's super cool birthday, at The Broadway this Saturday at Midnight ",
            " Amy's awesome rave, in the woods tomorrow at Noon, you'll need a mask and a torch ", 
            " Washing the dishes, with Dad tonight after dinner, love mum ", 
            " An intercity disco, between New York and San Francisco with The Vengaboys, As soon as the Vengabus gets here, I've heard it's coming "
        ];
        //find a party from the list
        partyItem = this.t(fakedParties[this.attributes.eventCounter]);
        this.attributes.eventCounter++;
        //Check if need an answer to a previous prompt
        if (this.attributes.countResponse == 1) {
                this.attributes.speechOutput = this.t('ANSWER_NO');
            } else if (this.attributes.countResponse == 2) {
                this.attributes.speechOutput = this.t('ANSWER_YES');
            }   
        //check if still have parties left in the list, if yes, move on to next invite if no give answer and prompt for a new intent. 
        if (partyItem) {
            this.handler.state = states.ACTIONMODE;
            this.attributes.speechOutput += this.t('ASK_FOR_RSVP');
            this.attributes.repromptSpeech = this.t('ANSWER_REPROMPT');
            //reads out the list
            this.emit(':ask', this.attributes.speechOutput + partyItem, this.attributes.repromptSpeech);
        } else {
            this.attributes.speechOutput += this.t('NO_PARTIES_IN_LIST');
            this.attributes.repromptSpeech = this.t('WHAT_NEXT');
            this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "In a while crocodile");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "In a while crocodile");
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function(){
       console.log("UNHANDLED");
       var message = this.t('ERROR_MESSAGE');
       this.emit(':ask', message);
    }
});
//The function to take action by Alexa according to the response of the person. 
var actionHandlers = Alexa.CreateStateHandler(states.ENDMODE, {
    'NewSession': function() {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },
    //If the person said yest to the invite, functionalities to add: updating the status of the invite and sending out the response
    'AMAZON.YesIntent': function() {
        this.attributes.countResponse = 2;
        this.handler.state = states.PARTYMODE;
        this.emitWithState('GetPartyIntent');
    },
    //If the person said no to the invite, functionalities to add: updating the status of the invite and sending out the response
    'AMAZON.NoIntent': function() {
        this.attributes.countResponse = 1;
        this.handler.state = states.PARTYMODE;
        this.emitWithState('GetPartyIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'CANCEL_MESSAGE');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'CANCEL_MESSAGE');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }, 
});

//Messages used trhoughout the skill
const languageStrings = {
    'en-US' : {
        translation: {
            ANSWER_NO: "Sure? You should go out more often. Your social life is worse than mine. But okay, this party wasn\'t that cool anyways.",
            ANSWER_REPROMPT: "Yes or No?",
            ANSWER_YES: "Cool, I\'ve added it to your calendar.",
            ASK_FOR_RSVP: "Do you want to go to",
            CANCEL_MESSAGE: "In a while crocodile",
            ERROR_MESSAGE: "Oops, something went wrong, say give me my partylist to continue hearing your invites",
            HELP_MESSAGE: "If you want to hear your list of invites say give me my party list",
            HELP_REPROMPT: "You can get your invites by saying give me my party list or you can exit by saying stop",
            NO_PARTIES_IN_LIST: "Sorry matey, no more parties for you!",
            STOP_MESSAGE: "Until next time; Party on!",
            WELCOME_MESSAGE: "I Like To Party! Do you like to party? Let's take a look at your invites",
            WELCOME_REPROMT: "Hello. Are you there? Would you like to hear your party list?",
            WHAT_NEXT: "What do you want to do next?",
        },
    },
};

//employs the code
exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(startHandlers, partyHandlers, actionHandlers);
    alexa.execute();
};