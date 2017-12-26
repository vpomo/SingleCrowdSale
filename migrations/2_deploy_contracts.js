const SingleCrowdSale = artifacts.require('./SingleCrowdSale.sol');

module.exports = (deployer) => {
    deployer.deploy(SingleCrowdSale);
};
