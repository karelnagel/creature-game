import Web3 from 'web3'
import { ethers } from "ethers";


class Helper {
    chainId = '0x00';
    networkRpc = '';

    constructor(chainId, networkRpc) {
        this.chainId = chainId;
        this.networkRpc = networkRpc
    }

    async loadWeb3() {
        if (window.ethereum) {
            //Todo remove and change bottom to window.ethereum.Contract()
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
        }
        else {
            window.alert('Non-Ethereum browser detected. This site can only be used with Ethereum browser, you should consider using MetaMask!')
        }
    }

    async getToken(Token) {
        const web3 = window.web3
        const networkId = await window.web3.eth.net.getId()

        var networkData = Token.networks[networkId]

        if (!networkData) {
            await this.connectToPreferredNetwork()
            const networkId = await web3.eth.net.getId()
            networkData = Token.networks[networkId]
        }
        if (networkData) {
            const abi = Token.abi
            const tokenAddress = networkData.address
            return new web3.eth.Contract(abi, tokenAddress)
        }
        else
            window.alert('You are using wrong chain')
    }

    async connectToPreferredNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{ chainId: this.chainId, rpcUrl: this.networkRpc }],
                    });
                } catch (addError) {
                }
            }
            
        }
    }

    async getAddressAndEns() {
        const [account] = await window.ethereum.request({ method: 'eth_accounts' });
        let ens = ''

        //Getting ENS
        var provider = new ethers.providers.Web3Provider(window.ethereum);
        if (provider)
            ens = await provider.lookupAddress(account)
        return [account, ens]
    }
}
export default Helper;