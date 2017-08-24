'use strict';
/**
 * Write the unit tests for your transction processor functions here
 */

var AdminConnection = require('composer-admin').AdminConnection;
var BrowserFS = require('browserfs/dist/node/index');
var BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
var BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
var path = require('path');
var fs = require('fs');

require('chai').should();

var bfs_fs = BrowserFS.BFSRequire('fs');
var NS = 'com.acme.mnpnetwork';

describe('#'+NS, function() {

    var businessNetworkConnection;

    before(function() {
        BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
        var adminConnection = new AdminConnection({ fs: bfs_fs });
        return adminConnection.createProfile('defaultProfile', {
            type: 'embedded'
        })
        .then(function() {
            return adminConnection.connect('defaultProfile', 'admin', 'Xurw3yU9zI0l');
        })
        .then(function() {
            return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
        })
        .then(function(businessNetworkDefinition) {
            return adminConnection.deploy(businessNetworkDefinition);
        })
        .then(function() {
            businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
            return businessNetworkConnection.connect('defaultProfile', 'mnp', 'admin', 'Xurw3yU9zI0l');
        });
    });

    describe('ChangeOperator()', function() {

        it('should change the value property of Asset to newValue', () => {

            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            // create a user
            var user = factory.newResource(NS, 'Operator', '20406');
            user.name = "ftel"
            var user1 = factory.newResource(NS, 'Operator', '20407');
            user1.name = "dtel"

            // create the asset
            var asset = factory.newResource(NS, 'Subscriber', '31632000222');
            // asset.originalOperator = user
            asset.originalOperator = factory.newRelationship(NS,'Operator',user.$identifier);
            // asset.currentOperator = user1
            asset.currentOperator = factory.newRelationship(NS,'Operator',user.$identifier);
            asset.name = "Faizan"

            var changeOperator = factory.newTransaction(NS, 'ChangeOperator');
            changeOperator.subscriber = factory.newRelationship(NS, 'Subscriber', asset.$identifier);
            changeOperator.newOperator = factory.newRelationship(NS, "Operator", user1.$identifier);

            // Get the asset registry.
            return businessNetworkConnection.getAssetRegistry(NS + '.Subscriber')
            .then(function(registry) {

                // Add the Asset to the asset registry.
                return registry.add(asset)
                .then(function() {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Operator');
                })
                .then(function(userRegistry) {
                    userRegistry.add(user1);
                    return userRegistry.add(user);
                })
                .then(function() {
                    // submit the transaction
                    return businessNetworkConnection.submitTransaction(changeOperator);
                })
                .then(function() {
                    return businessNetworkConnection.getAssetRegistry(NS + '.Subscriber');
                })
                .then(function(registry) {
                    // get the listing
                    return registry.get(asset.$identifier);
                })
                .then(function(newAsset) {
                    newAsset.currentOperator.$identifier.should.equal(user1.$identifier);
                });
            });
        });
    });
});