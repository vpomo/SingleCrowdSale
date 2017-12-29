var SingleCrowdSale = artifacts.require("./SingleCrowdSale.sol");

contract('SingleCrowdSale', (accounts) => {
    var contract;
    var account_one = accounts[0];
    var account_two = accounts[1];
    var rate = 20;
    var buyWei = 80000;

it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await SingleCrowdSale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        //console.log("contract address = " + contract.address);
        assert.notEqual(undefined, contract.address);
    });

    it('verification of receiving Ether', async ()  => {
        var totalSupplyBefore = await contract.totalSupply.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("totalSupply = " + totalSupplyBefore);

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});

        var totalSupplyAfter = await contract.totalSupply.call();
        //console.log("totalSupply = " + totalSupplyAfter);
        assert.isTrue(totalSupplyBefore < totalSupplyAfter);
        assert.equal(0, totalSupplyBefore);
        assert.equal(rate*buyWei, totalSupplyAfter);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

    });

    it('verification of refund Ether', async ()  => {
        var weiRaisedBefore = await contract.weiRaised.call();
        assert.equal(buyWei, weiRaisedBefore);

        await contract.enableRefunds({from:accounts[0]});

        var mintingFinished = await contract.mintingFinished.call();
        assert.equal(true, mintingFinished );
        var state = await contract.state.call();
        assert.equal(1,state);
        var goalReached = await contract.goalReached.call();
        assert.equal(false, goalReached);

        var isFinalized = await contract.isFinalized.call();
        assert.equal(true, isFinalized);

        await contract.refund(accounts[2],{from:accounts[0]});
        var weiRaisedAfter = await contract.weiRaised.call();
        assert.equal(0, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        assert.equal(0, depositedAfter);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.equal(0, balanceAccountTwoAfter);

});


    it('get current time', async ()  => {
        //var curTime = await contract.getDeposited.call(accounts[2]);
        //console.log("current time = " + curTime);
    });



/*
    contract('SingleCrowdSale', function (accounts) {
        it("should assert true", function (done) {
            var contract = SingleCrowdSale.deployed(12345);
            assert.isTrue(true);
            done();
        });
*/

    /*
        it("should symbol=PVA for contract PvaToken", function () {
            return SingleCrowdSale.deployed().then(function (instance) {
                return instance.symbol.call();
            }).then(function (currentSymbol) {
                assert.equal(currentSymbol, "PVA", " an not empty string has arrived");
            });
        });


        it("should totalSupply=2e+22 for contract PvaToken", function () {
            return PvaToken.deployed().then(function (instance) {
                return instance.totalSupply.call();
            }).then(function (totalPva) {
                console.log("totalSupply = " + totalPva);
                assert.equal(totalPva, 2e+22, " an equivalent to 2e+22");
            });
        });


        it("should balanceOf() for contract PvaToken", function () {
            var account_one = accounts[0];
            var account_two = accounts[1];
            return PvaToken.deployed().then(function (instance) {
                pva = instance;

                return pva.balanceOf.call(account_one);
            }).then(function (balance) {
                console.log("balanceOf(" + account_one + "): " + balance);
                assert.equal(balance, 2e+22, " an balanceOf(address_one) equal 2e+22");

                return pva.balanceOf.call(account_two);
            }).then(function (balance) {
                console.log("balanceOf(" + account_two + "): " + balance);
                assert.equal(balance, 0, " an balanceOf(address_two) equal 0");

                //return pva.transfer.call(account_two, 100);
            });
        });


        it("should transfer() for contract PvaToken", function () {
            var account_one = accounts[0];
            var account_two = accounts[1];
            return PvaToken.deployed().then(function (instance) {
                pva = instance;

                return pva.transfer(account_two, 20000, {from: account_one});
            }).then(function (resultTransfer) {
                console.log("result transfer = " + resultTransfer.tx);
                assert.notEqual(resultTransfer.tx, undefined, " Result transfer to address_two equal true");

                return pva.balanceOf.call(account_one);
            }).then(function (balance) {
                console.log("balanceOf(" + account_one + "): " + balance);
                assert.equal(balance, 2e+22 - 20000, " an balanceOf(address_one) not equal 2e+22");

                return pva.balanceOf.call(account_two);
            }).then(function (balance) {
                console.log("balanceOf(" + account_two + "): " + balance);
                assert.equal(balance, 20000, " an balanceOf(address_two) equal 20000");

    /!*
                return pva.getCurrentData.call();
            }).then(function (curDate) {
                console.log("curDate =  " + curDate);
    *!/


            });
        });
    */


});



