// Solana Playground Balance Checker (No Airdrop)
// Paste this inside client/client.ts in beta.solpg.io
// `pg.connection`, `pg.wallet`, and `web3` are already provided by Playground

async function checkBalance(publicKey: any) {
  const balanceInLamports = await pg.connection.getBalance(publicKey);
  const balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;
  return balanceInSol;
}

async function main() {
  console.log("✅ Using Playground's devnet connection\n");

  // 1. Generate a new wallet
  const wallet = web3.Keypair.generate();
  console.log("👤 New Wallet Generated:");
  console.log("   Public Key: ", wallet.publicKey.toString());

  // 2. Check its balance (no airdrop — will show 0 SOL since it's brand new)
  const balance = await checkBalance(wallet.publicKey);
  console.log("📊 Balance:", balance, "SOL");

  // 3. Also check Playground's own connected wallet balance
  const pgWalletBalance = await checkBalance(pg.wallet.publicKey);
  console.log("👛 Playground wallet balance:", pgWalletBalance, "SOL");

  // 4. (Optional) Check the balance of any custom wallet address
  // Uncomment and put in any address you like:
  //
  // const customAddress = "YourWalletAddressHere";
  // const customBalance = await checkBalance(new web3.PublicKey(customAddress));
  // console.log(`📊 Balance of ${customAddress}:`, customBalance, "SOL");
}

main().catch((err) => {
  console.error("❌ Error occurred:", err.message);
});
