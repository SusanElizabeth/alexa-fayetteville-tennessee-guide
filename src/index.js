var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Fayetteville";

var numberOfResults = 3;

var APIKey = "0d81bb6d57f947c38f62919e514403f2";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Fayetteville is the largest city in Lincoln County. The city was established in 1809 by an Act of the Tennessee General Assembly.  The lands that include Lincoln County and Fayetteville were originally part of Cherokee and Chickasaw land. They were ceded to the United States in 1806.  The estimated population as of 2015 is 7,121.";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location + "?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [{
    name: "Lincoln Theatre",
    content: "located in the Fayetteville square, The theatre was built in 1951, so you can see your current movie with a 1950s feel.",
    location: "The theatre is located at 120 College Street East Fayetteville, Tennessee 37334 \n across from the Fayetteville Courthouse.",
    contact: "manager@lincolntheaterfayetteville.com\n 931 433 1943"
}, {
    content: "The Museum & Event Center is Lincoln County's only public location housing artifacts from the community's history.  The museum is located inside the Borden Milk Plant, constructed in 1927, and was donated by the William R. Carter family to serve as a local museum in 1987.",
    name: "Fayetteville Lincoln County Museum",
    location: "521 South Main Street, Fayetteville, Tennessee 37334",
    contact: "931 438 0339"
}, {
    name: "Stone Bridge Park",
    content: "This public park has a miniature of 1861 stone bridge (the original fell in 1969), visitor center, pavilions, walking track, restrooms, waterfall, 1796 cabin and canoe access to Elk River.",
    location: "2061 Thornton Taylor Parkway Fayetteville, Tennessee 37334",
    contact: "931 433 6059"
}, {
    name: "Camp Blount Monument",
    content: "The Camp Blount marker, erected in 1998, is based on The camp was located along the Elk River and was a meeting point for the Tennessee soldiers who were serving under General Andrew Jackson in the Creek War of 1813-1814. Camp Blount also was a meeting point for soldiers during the Seminole Wars in 1818 and 1836, and for both Confederate and Federal troops during the Civil War.",
    location: "1202 Huntsville Highway, Fayetteville, Tennessee 37334",
    contact: "931 433 2921"
}, {
    name: "Honey's Restaurant",
    content: "During World War II, several bases were located near the Fayetteville area. Many military personnel frequently visited Honey’s to enjoy the many pool matches and the always great hamburgers. The “Slawburgers“, as the hamburgers were now being called, had become a legend truly by “word-of-mouth”. After the war, many of those same military personnel have returned and shared stories about this era of Honeys.",
    location: "109 Market Street East Fayetteville, Tennessee",
    contact: "931 433 1181"
} ];

var topFive = [{
    number: "1",
    caption: "Visit the Host of Christmas Past.",
    more: "Celebrating a tradition that began 48 years ago when The Flower House hosted a Christmas Open House. Other businesses and organizations began participating 23 years ago in what is now the Fayetteville…Host of Christmas Past. Each year, on the second weekend in November, downtown Fayetteville becomes the setting for a magical holiday experience. With an array of music, food, exhibits, shops, candlelight and Christmas spirit the entire community joins together to promote qualities of the town.",
    location: "208 Elk Avenue South, Fayetteville, Tennessee, 37334",
    contact: "931 433 1234"
}, {
    number: "2",
    caption: "Get antique shopping on the Historic Fayetteville Square.",
    more: "With the new vintage revival sweeping the nation, hipsters and homemakers alike have developed a newfound taste for antique shops. Whether you’re looking for that perfect vintage dresser or something quirky to put on your shelves, these Tennessee treasures are just waiting for you to find ’em.",
    location: "112 Main Ave S, Fayetteville, TN 37334",
    contact: "931 433 2454"
}, {
    number: "3",
    caption: "Visit the historic Fayetteville Lincoln County Museum.",
    more: "The Museum & Event Center is Lincoln County's only public location housing artifacts from the community's history.  The museum is located inside the Borden Milk Plant, constructed in 1927, and was donated by the William R. Carter family to serve as a local museum in 1987.",
    location: "521 South Main Street, Fayetteville, Tennessee 37334",
    contact: "931 438 0339"
}, {
    number: "4",
    caption: "See a movie at the history Lincoln Theatre.",
    more: "located in the Fayetteville square, The theatre was built in 1951, so you can see your current movie with a 1950s feel.",
    location: "120 College Street East, Fayetteville, TN 37334",
    contact: "120 433 1943"
}, {
    number: "5",
    caption: "Visit Sir's Fabrics, a Fayetteville landmark",
    more: "Sir's Fabrics is one of the oldest and largest fabric stores in the Southeast, and now Sir's is a premier online fabric store and your new source for discount upholstery fabric, drapery fabric, trims, ribbon, and more.",
    location: "110 Elk Avenue North, Fayetteville, TN 37334",
    contact: "931 433 2487"
}];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function() {
        this.handler.state = states.SEARCHMODE;

        output = welcomeMessage;

        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'getOverview': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getNewsIntent': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'Unhandled': function() {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'SessionEndedRequest': function() {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    }
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'AMAZON.HelpIntent': function() {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getOverview': function() {

        output = locationOverview;

        this.emit(':tellWithCard', output, location, locationOverview);
    },

    'getAttractionIntent': function() {

        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },

    'getTopFiveIntent': function() {

        output = topFiveIntro;

        var cardTitle = "";

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }

        output += topFiveMoreInfo;

        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },

    'AMAZON.YesIntent': function() {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'AMAZON.NoIntent': function() {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'getNewsIntent': function() {
        httpGet(location, function(response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            } else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function() {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function() {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function() {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'AMAZON.HelpIntent': function() {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function() {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function() {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },

    'AMAZON.NoIntent': function() {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function() {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function() {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function() {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function(event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
    console.log("/n QUERY: " + query);

    var options = {
        //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Fayetteville&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function() {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
    function(n) {
        return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
    };
