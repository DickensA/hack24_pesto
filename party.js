//Installed node modules: jquery underscore request express jade shelljs passport http sys lodash async mocha chai sinon sinon-chai moment connect validator restify ejs ws co when helmet wrench brain mustache should backbone forever debug


'use strict';

const Alexa = require('alexa-sdk');
//const parties = require('./parties'); // TODO Need to figure out how to put up this list
// would come from a web service, json file etc. in the real deal

//const APP_ID = undefined; // TODO replace with our app ID (OPTIONAL).

var event_counter = 0;

const handlers ={
    //new session of our skill
    'NewSession': function() {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE' /*any variables we use in the message*/);
        //no reply or a reply that's not recognized will trigger this
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    //Our own intent function for getting alexa to read out the party list?
    'GetPartyIntent' : function() {
        // const partyList = this.t('PARTIES');
        
        
        // new NEW nEW NEW
        var partyList = "";
        
        let fakedParties = [
            "super cool birthday",
            "awesome rave"
        ];
        
        
        // check to make sure we stay inside the list index
        if (event_counter >= (fakedParties.length - 1)) {
            // all events have been accessed, we should skip to the first event again
            event_counter = 0;
            
        } else {
            partyList = this.t(fakedParties[event_counter]);
            event_counter++;
        }
        // NEW NEW new end
        
        
        //if have parties in the list
        if (partyList) {
            //reads out the list
            this.emit(':tell', partyList);
        } else {
            this.attributes.speechOutput = this.t('NO_PARTIES_IN_LIST');
            this.emit(':tell', this.attributes.speechOutput);
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
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },        
};



const languageStrings = {
    'en-US' : {
        translation: {
            WELCOME_MESSAGE: "Do you like to party? I Like To Party! You can ask me about your upcoming events. Would you like to hear your party list?",
            WELCOME_REPROMT: "You can ask me about your upcoming events. Would you like to hear your party list?",
            PARTIES: "Parteeeey", // not sure how this works, but we need this to get the party list
            NO_PARTIES_IN_LIST: "Sorry matey, no parties today!",
            HELP_MESSAGE: "Help",
            HELP_REPROMPT: "Help reprompt",
            STOP_MESSAGE: "Have fun!",
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
