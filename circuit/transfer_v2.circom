pragma circom 2.1.4;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/bitify.circom";

template TransferCheckV2() {
    signal input senderBalance;        
    signal input transferAmount;       
    signal input assetId;             
    signal input recipientId;         
    signal input maxAmount;           
    
    signal output valid;              
    signal output newBalance;         
    
    component ltMax = LessThan(64);   
    component gtZero = GreaterThan(32); 
    
    ltMax.in[0] <== transferAmount;
    ltMax.in[1] <== maxAmount + 1;   
    
    gtZero.in[0] <== transferAmount;
    gtZero.in[1] <== 0;              
    
    component balanceCheck = LessEqThan(64);
    balanceCheck.in[0] <== transferAmount;
    balanceCheck.in[1] <== senderBalance; 
    
    component assetValidation = GreaterThan(32);
    assetValidation.in[0] <== assetId;
    assetValidation.in[1] <== 0;     
    
    newBalance <== senderBalance - transferAmount;
    
    component recipientValidation = GreaterThan(64);
    recipientValidation.in[0] <== recipientId;
    recipientValidation.in[1] <== 0; 
    
    signal intermediate1;
    signal intermediate2;
    signal intermediate3;

    intermediate1 <== ltMax.out * gtZero.out;
    intermediate2 <== intermediate1 * balanceCheck.out;
    intermediate3 <== intermediate2 * assetValidation.out;
    valid <== intermediate3 * recipientValidation.out;
}

component main { public [maxAmount, assetId] } = TransferCheckV2();
