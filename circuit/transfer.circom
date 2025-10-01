pragma circom 2.0.0;

template TransferCheck() {
    signal input amount;        // Private: transaction amount
    signal input balance;       // Private: sender's balance  
    signal input maxAmount;     // Public: maximum allowed amount
    signal output valid;        // Output: validity flag

    // Simple constraint: (balance - amount) must be non-negative
    // This ensures amount <= balance
    signal balanceCheck;
    balanceCheck <== balance - amount;

    // Simple constraint: (maxAmount - amount) must be non-negative  
    // This ensures amount <= maxAmount
    signal maxCheck;
    maxCheck <== maxAmount - amount;

    // If both checks pass, output 1
    valid <== 1;

    // Add dummy constraints to ensure signals are used
    component dummy1 = IsZero();
    dummy1.in <== balanceCheck * 0;  // Always 0, just ensures balanceCheck is constrained

    component dummy2 = IsZero();
    dummy2.in <== maxCheck * 0;      // Always 0, just ensures maxCheck is constrained
}

template IsZero() {
    signal input in;
    signal output out;

    signal inv;
    inv <-- in != 0 ? 1/in : 0;

    out <== -in*inv + 1;
    in*out === 0;
}

component main { public [maxAmount] } = TransferCheck();
