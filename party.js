//Installed node modules: jquery underscore request express jade shelljs passport http sys lodash async mocha chai sinon sinon-chai moment connect validator restify ejs ws co when helmet wrench brain mustache should backbone forever debug

'use strict';

const Alexa = require('alexa-sdk');

//defining the states
var states = {
    // setting up states
    PARTYMODE: '_PARTYMODE',
    ENDMODE: '_ENDMODE'
}

//Initializing Alexa and the scroll through the list of events
var  startHandlers ={
    //new session of our skill
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes.eventCounter = 0;
            this.attributes.countResponse = 0;
        }
        this.handler.state = states.PARTYMODE;
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE');
        //no reply or a reply that's not recognized will trigger this
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    }
}; 
//The function that controls the party listing functionality of Alexa
var partyHandlers = Alexa.CreateStateHandler(states.PARTYMODE, {
    'NewSession': function() {
         this.emit('NewSession'); // Uses the handler in startHandlers
    },
    //Our own intent function for getting alexa to read out the party list
    'GetPartyIntent' : function() {
        var partyList = "";
        let fakedParties = [
            " Saria's super cool birthday, at The Broadway this Saturday at Midnight ",
            " Amy's awesome rave, in the woods tomorrow at Noon, you'll need a mask and a torch ", 
            " Washing the dishes, with Dad tonight after dinner, love mum ", 
            " An intercity disco, between New York and San Francisco with The Vengaboys, As soon as the Vengabus gets here, I've heard it's coming "
        ];
        
            partyList = this.t(fakedParties[this.attributes.eventCounter]);
            this.attributes.eventCounter++;
        //check if still have parties left in the list
        if (partyList) {
            this.handler.state = states.ENDMODE;
                if (this.attributes.countResponse == 1) {
                    this.attributes.speechOutput = this.t('This party wasn\'t that cool anyways. Do you want to go to');
                } else if (this.attributes.countResponse == 2) {
                    this.attributes.speechOutput = this.t('Cool, I\'ve added it to your calendar. Do you want to go to');
                } else {
                    this.attributes.speechOutput = this.t('Do you want to go to');
                }
            //reads out the list
            this.emit(':ask', this.attributes.speechOutput + partyList, 'Yes or No?');
        } else {
                if (this.attributes.countResponse == 1) {
                    this.attributes.speechOutput = this.t('This party wasn\'t that cool anyways. NO_PARTIES_IN_LIST');
                } else if (this.attributes.countResponse == 2) {
                    this.attributes.speechOutput = this.t('Cool, I\'ve added it to your calendar. NO_PARTIES_IN_LIST');
                } else {
                    this.attributes.speechOutput = this.t('NO_PARTIES_IN_LIST');
                }
            this.emit(':ask', this.attributes.speechOutput);
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
       this.handler.state = states.ENDMODE;
       var message = 'Say yes to continue hearing your invites';
       this.emit(':ask', message);
    }
});
//Functionality to take action by Alexa according to the response of the person. 
var endHandlers = Alexa.CreateStateHandler(states.ENDMODE, {
    'NewSession': function() {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },
    'AMAZON.YesIntent': function() {
        this.attributes.countresponse = 2;
        this.handler.state = states.PARTYMODE;
        this.emitWithState('GetPartyIntent');
    },
    'AMAZON.NoIntent': function() {
        this.attributes.countresponse = 1;
        this.handler.state = states.PARTYMODE;
        this.emitWithState('GetPartyIntent');
        //console.log("NOINTENT")
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
});

//some messages gathered together
const languageStrings = {
    'en-US' : {
        translation: {
            WELCOME_MESSAGE: "I Like To Party! Do you like to party? Let's take a look at your invites",
            WELCOME_REPROMT: "Hello. Are you there? Would you like to hear your party list?",
            //PARTIES: "Parteeeey", // not sure how this works, but we need this to get the party list
            NO_PARTIES_IN_LIST: "Sorry matey, no more parties for you!",
            HELP_MESSAGE: "Help",
            HELP_REPROMPT: "Help reprompt",
            STOP_MESSAGE: "Until next time; Party on!",
        },
    },
};

//employs the code
exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(startHandlers, partyHandlers, endHandlers);
    alexa.execute();
};