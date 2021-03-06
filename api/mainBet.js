/**
 * Created by mariostzakris on 12/06/15.
 */
'use strict';
var async = require('async');
var betfairService = require('./services/BetfairService');


var params = {
    filter:{}
};

module.exports = {

    startBet : function(next) {
        async.waterfall([
            function(callback){
                betfairService.login(function(error){
                    if(error){
                        betLogger.error("Login to betfair.com failed")
                    }else{
                        betLogger.info("Successfully logged in to betfair.com")
                        callback(null);
                    }
                })
            },
            function(callback){
                betfairService.listEvents(params, function(error, eventsIds){
                    if(error){
                        betLogger.error("Failed to get list of events");
                        callback(error);
                    }else{
                        betLogger.info("Successfully retrieved list events");
                        callback(null, eventsIds)

                    }
                })
            },
            function(eventsIds, callback){
                var params = {filter: {eventTypeIds:["1"]}};
                betfairService.listEvents(params, function(error, eventsIds){
                    if(error){
                        betLogger.error("Failed to get list of events");
                        callback(error);
                    }else{
                        betLogger.info("Successfully retrieved list events");
                        callback(null, eventsIds)

                    }
                })
            },
            function(eventIds, callback){
                var params = {
                    "filter": {
                        "eventIds": eventIds
                    },
                    "maxResults": "200",
                    "marketProjection": [
                    "COMPETITION",
                    "EVENT",
                    "EVENT_TYPE",
                    ],
                    "sort": "MAXIMUM_AVAILABLE"
                };
                betfairService.listMarketCatalogue(params, function(error, marketIds){
                    if(error){
                        betLogger.error("Failed to get list of market info");
                        callback(error);
                    }else{
                        betLogger.info("Successfully retrieved list of market info");
                        callback(null, marketIds)

                    }
                })
            },
            function(marketIds, callback){
                //var params = { "filter":{
                //    "marketIds": marketIds
                //    }
                //};
                var params = {
                    "marketIds": [marketIds[0], marketIds[1]],
                    "priceProjection":{"priceData":["EX_ALL_OFFERS"]},
                    "orderProjection":"EXECUTABLE"
                };

                //var filter = 	{"marketIds":["1.116312560"],"priceProjection":{"priceData":["EX_BEST_OFFERS"]},"marketProjection": "RUNNER_DESCRIPTION"}


                betfairService.listMarketBook(params, function(error, whatever){
                    if(error){
                        betLogger.error("Failed to get market book info");
                        callback(error);
                    }else{
                        betLogger.info("Successfully retrieved market book info");
                        callback(null, marketIds)

                    }
                })
            }
        ],
        function(error){
            next(error);
        })
    },


};
