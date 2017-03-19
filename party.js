<<<<<<< HEAD
//Installed node modules: jquery underscore request express jade shelljs passport http sys lodash async mocha chai sinon sinon-chai moment connect validator restify ejs ws co when helmet wrench brain mustache should backbone forever debug


'use strict';

const Alexa = require('alexa-sdk');
//const parties = require('./parties'); // TODO Need to figure out how to put up this list
// would come from a web service, json file etc. in the real deal

//const APP_ID = undefined; // TODO replace with our app ID (OPTIONAL).

var states = {
    // setting up states
    PARTYMODE: '_PARTYMODE',
    ENDMODE: '_ENDMODE'
}
//var event_counter = 0;

var  startHandlers ={
    //new session of our skill
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes.eventCounter = 0;
        }
        this.handler.state = states.PARTYMODE;
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE');
        //no reply or a reply that's not recognized will trigger this
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emitwithState(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    }
}; 

var partyHandlers = Alexa.CreateStateHandler(states.PARTYMODE, {
    'NewSession': function() {
         this.emitwithState('NewSession'); // Uses the handler in startHandlers
    },
    //Our own intent function for getting alexa to read out the party list?
    'GetPartyIntent' : function() {
        // const partyList = this.t('PARTIES');
        var partyList = "";
        let fakedParties = [
            "super cool birthday",
            "awesome rave"
        ];
        
        // check to make sure we stay inside the list index
        if (this.attributes.eventCounter >= (fakedParties.length - 1)) {
            // all events have been accessed, we should skip to the first event again
            this.attributes.eventCounter = 0;
            
        } else {
            partyList = this.t(fakedParties[this.attributes.eventCounter]);
            this.attributes.eventCounter++;
            //var event_counter = this.attributes["eventCounter"]+1;
        }
    
        //if have parties in the list
        if (partyList) {
            //reads out the list
            this.emitwithState(':tell', partyList);
        } else {
            this.attributes.speechOutput = this.t('NO_PARTIES_IN_LIST');
            this.emitwithState(':tell', this.attributes.speechOutput);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
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
});

var endHandlers = Alexa.CreateStateHandler(states.ENDMODE, {
    'NewSession': function() {
        this.handler.state = '';
        this.emitwithState('NewSession');
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


const languageStrings = {
    'en-US' : {
        translation: {
            WELCOME_MESSAGE: "I Like To Party! Do you like to party? Let's take a look at your invites",
            WELCOME_REPROMT: "Hello. Are you there? Would you like to hear your party list?",
            //PARTIES: "Parteeeey", // not sure how this works, but we need this to get the party list
            NO_PARTIES_IN_LIST: "Sorry matey, no parties today!",
            HELP_MESSAGE: "Help",
            HELP_REPROMPT: "Help reprompt",
            STOP_MESSAGE: "Until next time; Party on!",
        },
    },
};

var eventListCountHandlers = {

    'NextItem': function(callback) {
        this.handler.state = states.PARTYMODE;
        this.attributes['eventCounter']++;
        callback();
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(startHandlers, partyHandlers, endHandlers);
    alexa.execute();
};
=======
//Installed node modules: jquery underscore request express jade shelljs passport http sys lodash async mocha chai sinon sinon-chai moment connect validator restify ejs ws co when helmet wrench brain mustache should backbone forever debug


'use strict';

const Alexa = require('alexa-sdk');

var  handlers = {
    //new session of our skill
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes.eventCounter = 0;
        }
        this.handler.state = states.PARTYMODE;
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE');
        //no reply or a reply that's not recognized will trigger this
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'GetPartyIntent' : function() {
        // const partyList = this.t('PARTIES');
        var partyList = "";
        let fakedParties = [
            "super cool birthday",
            "awesome rave"
        ];
        
        for (eventCounter = 0; eventCounter < fakedParties.length; eventCounter++) {
            partyList = this.t(fakedParties[this.attributes.eventCounter]);
            eventCounter++;
            this.emit(':tell', partyList);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
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
}; 

const languageStrings = {
    'en-US' : {
        translation: {
            WELCOME_MESSAGE: "I Like To Party! Do you like to party? Let's take a look at your invites",
            WELCOME_REPROMT: "Hello. Are you there? Would you like to hear your party list?",
            //PARTIES: "Parteeeey", // not sure how this works, but we need this to get the party list
            NO_PARTIES_IN_LIST: "Sorry matey, no parties today!",
            HELP_MESSAGE: "Help",
            HELP_REPROMPT: "Help reprompt",
            STOP_MESSAGE: "Until next time; Party on!",
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(startHandlers, partyHandlers, endHandlers);
    alexa.execute();
};
>>>>>>> e99fd5005f3361224250387d59ac5bf7b47a453c
