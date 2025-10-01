const Groth16Verifier = artifacts.require("Groth16Verifier");

module.exports = function(deployer) {
  deployer.deploy(Groth16Verifier);
};
