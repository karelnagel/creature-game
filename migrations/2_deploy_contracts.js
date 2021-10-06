const CreatureToken = artifacts.require("CreatureToken");

module.exports = function(deployer) {
  deployer.deploy(CreatureToken);
};
