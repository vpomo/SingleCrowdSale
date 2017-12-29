const SingleCrowdSale = artifacts.require('./SingleCrowdSale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var startTime = 1545825600;
    var endTime = 1551182400;
    var rate = 20;
    var goal = 3000000;
    var cap = 3200000;
    var wallet = "0xaa347ae50194bd91a4641658f56611edead0d993";

    deployer.deploy(SingleCrowdSale, startTime, endTime, rate, goal, cap, wallet);

//    deployer.deploy(SingleCrowdSale);
};
