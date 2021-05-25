import Web3 from 'web3';
import Web3Modal from 'web3modal';
import MewConnect from '@myetherwallet/mewconnect-web-client';
import ethProvider from 'eth-provider';
import Authereum from 'authereum';
import logoETH from '@/assets/img/eth.png';
import logoBSC from '@/assets/img/binance.png';
import { kikLotteryAddress, erc20burnableAddress } from '@/config/default.json';
import { erc20burnableAbi } from '@/config/erc20burnableAbi.json';
import { kikLotteryAbi } from '@/config/kikLotteryAbi.json';
class Bia {
  constructor() {
    this.connected = false;
    this.provider = '';
    this.web3 = '';
    this.accountAddress = '';
    this.contractAddress = '';
    this.contract = '';
    this.erc20BurnableContract = '';
    this.kikLotteryContract = '';
    this.daos = '';
    this.chainId = '';
    this.chainLogo = '';
    this.networkName = '';
    this.appChainId = '';
    this.canChangeNetwork = false;
  }

  getContractAddress(chainId) {
    switch (chainId) {
      case 4:
        // return '0x6545d195760E4680AF5656C0a143c654EF7B0424';
        return erc20burnableAddress;
      // return kikLotteryAddress;
      case 97:
        // return '0x204cD2BDB15aCF401B90cDE79b5Cc93dd2fEf816';
        return '';
      case 1:
        return '';
      case 56:
        return '';
      default:
        return '';
    }
  }

  getChainLogo(chainId) {
    switch (chainId) {
      case 4:
        return logoETH;
      case 97:
        return logoBSC;
      case 1:
        return logoETH;
      case 56:
        return logoBSC;
      default:
        return '';
    }
  }

  async getKikLotteryContract() {
    console.log(kikLotteryAbi);
    const contractAddress = kikLotteryAddress;
    if (contractAddress) {
      const contract = await new this.web3.eth.Contract(
        kikLotteryAbi,
        contractAddress
      );
      return contract;
    } else {
      return undefined;
    }
  }

  async getERC20BurnableContract() {
    console.log(erc20burnableAbi);
    // const contractAddress = this.getContractAddress(this.chainId);
    const contractAddress = erc20burnableAddress;
    if (contractAddress) {
      const contract = await new this.web3.eth.Contract(
        erc20burnableAbi,
        contractAddress
      );
      return contract;
    } else {
      return undefined;
    }
  }

  async approve(amount, callback = () => {}) {
    if (this.connected) {
      console.log(`from: ${this.accountAddress}`);
      await this.erc20BurnableContract.methods
        .approve(kikLotteryAddress, amount)
        .send({ from: this.accountAddress }, (err, result) => {
          callback(result);
        });
    } else {
      this.connect(() => {
        this.approve(amount, (data) => {
          console.log(`hash ${data}`);
        });
      });
    }
  }

  async join(amount, callback = () => {}) {
    console.log(`from: ${this.accountAddress}`);
    await this.kikLotteryContract.methods
      .join(amount)
      .send({ from: this.accountAddress }, (err, result) => {
        callback(result);
      });
  }

  getAllowance() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        this.erc20BurnableContract.methods
          .allowance(kikLotteryAddress, this.accountAddress)
          .call((err, res) => {
            if (err) {
              reject(err);
            }
            resolve(Number(res));
          });
      } else {
        resolve(0);
      }
    });
  }

  getJackpot() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        this.kikLotteryContract.methods.Jackpot().call((err, res) => {
          if (err) {
            reject(err);
          }
          resolve(Number(res));
        });
      } else {
        resolve(0);
      }
    });
  }

  getRoundNumber() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        this.kikLotteryContract.methods.RoundNumber().call((err, res) => {
          if (err) {
            reject(err);
          }
          resolve(Number(res));
        });
      } else {
        resolve(0);
      }
    });
  }

  getHistory(roundNumber) {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        this.kikLotteryContract.methods
          .History(roundNumber)
          .call((err, res) => {
            if (err) {
              reject(err);
            }
            resolve(JSON.stringify(res));
          });
      } else {
        resolve('');
      }
    });
  }

  async connect(callback = () => {}) {
    if (!this.connected) {
      const providerOptions = {
        mewconnect: {
          package: MewConnect, // required
          options: {
            infuraId: '1fa62a71dee94d9ebc1fc18e82207e55', // required
          },
        },
        frame: {
          package: ethProvider, // required
        },
        authereum: {
          package: Authereum, // required
        },
      };
      const web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        cacheProvider: false, // optional
        providerOptions, // required
        theme: 'dark',
      });
      web3Modal.clearCachedProvider();

      this.provider = await web3Modal.connect();
      this.web3 = new Web3(this.provider);
      this.web3.eth.net
        .isListening()
        .then(() => {
          this.web3.eth.getAccounts().then((e) => {
            this.accountAddress = e[0];
            this.web3.eth.getChainId().then(async (r) => {
              this.chainId = r;
              this.appChainId = r;
              this.connected = true;
              this.canChangeNetwork = true;
              this.chainLogo = this.getChainLogo(this.chainId);
              this.networkName = await this.web3.eth.net.getNetworkType();
              this.erc20BurnableContract = await this.getERC20BurnableContract();
              this.kikLotteryContract = await this.getKikLotteryContract();
              callback({
                address: this.accountAddress,
                success: true,
              });
              // if ([1, 4, 56, 97].includes(r)) {
              //     callback({
              //         address: this.accountAddress,
              //         success: true
              //     });
              // } else {
              //     callback(undefined);
              // }
            });
          });
        })
        .catch((e) => {
          console.log(e);
          callback({ address: null, success: false });
        });
    } else {
      this.networkName = await this.web3.eth.net.getNetworkType();
      callback({ address: this.accountAddress, success: true });
    }
  }

  setChainId(cb = () => {}) {
    this.web3.eth.getChainId().then(async (r) => {
      this.chainId = r;
      cb(r);
    });
  }

  spliceAddress(address) {
    return address.substr(0, 5) + '..' + address.substr(address.length - 4, 4);
  }
}
export default Bia;
