// genAiExplainer.js

function explainTransaction({ amount, recipient, proofValid, aiFlagged, privacy, time, error }) {
  let explanation = "";

  if (!proofValid) {
    explanation += `❌ Transaction failed: ${error || "The cryptographic proof was invalid. No funds were transferred."}\n`;
    return explanation;
  }

  if (aiFlagged) {
    explanation += `⚠️ Transaction flagged by AI: This transfer showed unusual patterns and may require further review.\n`;
  }

  if (amount === 0) {
    explanation += `ℹ️ No funds were transferred as the amount was zero.\n`;
  } else if (!recipient) {
    explanation += `❌ Transaction failed: No recipient specified.\n`;
  } else {
    explanation += `✅ Transaction successful: Your transfer of ${amount} units to ${recipient} was approved.\n`;
  }

  explanation += `- The system verified your balance using zero-knowledge proofs, so your private data was never exposed.\n`;
  explanation += `- Proof generation took ${time || "less than 1 second"}.\n`;
  explanation += privacy
    ? "- Your actual balance and transfer amount remain confidential throughout the process.\n"
    : "";

  return explanation;
}

// Example usage:
const testCases = [
  {
    amount: 2000,
    recipient: "0x123...abcd",
    proofValid: true,
    aiFlagged: false,
    privacy: true,
    time: "0.24s"
  },
  {
    amount: 5000,
    recipient: "0x456...efgh",
    proofValid: false,
    aiFlagged: false,
    privacy: true,
    time: "0.25s",
    error: "Insufficient balance for transfer."
  },
  {
    amount: 1000,
    recipient: "0x789...ijkl",
    proofValid: true,
    aiFlagged: true,
    privacy: true,
    time: "0.22s"
  },
  {
    amount: 0,
    recipient: "0xabc...defg",
    proofValid: true,
    aiFlagged: false,
    privacy: true,
    time: "0.20s"
  },
  {
    amount: 1000,
    recipient: "",
    proofValid: true,
    aiFlagged: false,
    privacy: true,
    time: "0.21s"
  }
];

testCases.forEach((txResult, idx) => {
  console.log(`--- Transaction ${idx + 1} ---`);
  console.log(explainTransaction(txResult));
});
