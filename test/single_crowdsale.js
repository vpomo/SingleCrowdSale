var SingleCrowdSale = artifacts.require("./SingleCrowdSale.sol");

contract('SingleCrowdSale', (accounts) => {
    var contract;
    var account_one = accounts[0];
    var account_two = accounts[1];
    var rate = 20;
    var buyWei = 80000;
    //@ param testedRefund use test Refund or Close
    var testedRefund = true;

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

    it('verification of refund Ether or close smart contract', async ()  => {
        if (testedRefund) {
            console.log("Tested Refund smart contract");
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
        } else {

            console.log("Tested Close smart contract");
            var weiRaisedBefore = await contract.weiRaised.call();
            assert.equal(buyWei, weiRaisedBefore);

            await contract.close({from:accounts[0]});

            var mintingFinished = await contract.mintingFinished.call();
            assert.equal(true, mintingFinished );
            var state = await contract.state.call();
            assert.equal(2,state);
            var goalReached = await contract.goalReached.call();
            assert.equal(false, goalReached);

            var isFinalized = await contract.isFinalized.call();
            assert.equal(true, isFinalized);
        }

    });


    it('get current balance', async ()  => {
        var curBalance = await contract.currentBalance.call();
        console.log("current balance = " + curBalance);
    });


});



