'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {com.acme.mnpnetwork.ChangeOperator} changeOperator
 * @transaction
 */
function onChangeOperator(changeOperator) {
    var assetRegistry;
    var id = changeOperator.subscriber.msisdn;
    var oldOperator = changeOperator.subscriber.currentOperator
    return getAssetRegistry('com.acme.mnpnetwork.Subscriber')
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(asset) {
            asset.currentOperator = changeOperator.newOperator;
            return assetRegistry.update(asset);
        })
        .then(function () {
            console.log("Firing event")
            var event = getFactory().newEvent('com.acme.mnpnetwork','SubscriberChangeEvent');
            event.subscriber = changeOperator.subscriber;
            event.oldOperator = oldOperator;
            event.newOperator = changeOperator.newOperator;
            emit(event);
        });
}