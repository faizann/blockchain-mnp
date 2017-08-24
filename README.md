# Mobile Number Portability blockchain

#### Usage instructions

* Download [mnpnetwork.bna](dist/mnpnetwork.bna) file
* Visit https://composer-playground.mybluemix.net/
* In the Define tab import the mnpnetwork.bna file.


* Create 3 participant operators with following info
* ```mccmnc:20404 name:vodafone```
* ```mccmnc:20416 name:tmobile```
* ```mccmnc:20408 name:kpn```


* Create a subscriber
* ```msisdn:1234```
* ```name: steve```
* ```originalOperator: 20404```
* ```currentOperator: 20404```


* Submit a transaction
* ```msisdn: 1234```
* ```mccmnc: 20416```

You will see the transactions in the ‘All transactions’ list, and event is triggered with the information as well. When you look at the Subscriber in the assets you will notice that currentOperator has changed to the 20416 which is T-mobile. You can create as many such transactions and see the whole trail in the transactions.

## Licence
checkout LICENCE.md
