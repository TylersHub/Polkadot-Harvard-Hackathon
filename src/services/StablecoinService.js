const { ethers } = require('ethers');
const ERC20_ABI = require('../contracts/abis/ERC20.json');

class StablecoinService {
    constructor(provider) {
        this.provider = new ethers.providers.JsonRpcProvider(process.env.MOONBASE_RPC_URL);
        this.supportedStablecoins = {
            USDT: process.env.USDT_CONTRACT_ADDRESS,
            USDC: process.env.USDC_CONTRACT_ADDRESS
        };
    }

    async getContract(stablecoinSymbol) {
        const address = this.supportedStablecoins[stablecoinSymbol];
        if (!address) throw new Error('Unsupported stablecoin');
        return new ethers.Contract(address, ERC20_ABI, this.provider);
    }

    async getBalance(walletAddress, stablecoinSymbol) {
        const contract = await this.getContract(stablecoinSymbol);
        const balance = await contract.balanceOf(walletAddress);
        return ethers.utils.formatUnits(balance, await contract.decimals());
    }

    async approveSpending(amount, stablecoinSymbol, spenderAddress, signerPrivateKey) {
        const signer = new ethers.Wallet(signerPrivateKey, this.provider);
        const contract = await this.getContract(stablecoinSymbol);
        const contractWithSigner = contract.connect(signer);
        
        const tx = await contractWithSigner.approve(spenderAddress, amount);
        return await tx.wait();
    }
}

module.exports = new StablecoinService();