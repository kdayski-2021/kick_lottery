import Web3 from 'web3';
import Web3Modal from 'web3modal';
import MewConnect from '@myetherwallet/mewconnect-web-client';
import ethProvider from 'eth-provider';
import Authereum from 'authereum';
import logoETH from '@/assets/img/eth.png';
import logoBSC from '@/assets/img/binance.png';
import {
  kikLotteryAddress,
  erc20burnableAddress,
  networkParameters,
} from '@/config/default.json';
import { erc20burnableAbi } from '@/config/erc20burnableAbi.json';
import { kickLotteryAbi } from '@/config/kickLotteryAbi.json';
class Bia {
  constructor() {
    this.connected = false;
    this.provider = '';
    this.web3 = '';
    this.accountAddress = '';
    this.web3Infura = '';
    this.erc20BurnableContractRpc = '';
    this.kikLotteryContractRpc = '';
    this.contract = '';
    this.erc20BurnableContract = '';
    this.kikLotteryContract = '';
    this.chainId = '';
    this.chainLogo = '';
    this.networkName = '';
    this.appChainId = '';
    this.canChangeNetwork = false;
  }

  async connectRpc() {
    this.web3Infura = new Web3(networkParameters.rpc);
    this.erc20BurnableContractRpc = await this.getERC20BurnableContract(
      this.web3Infura
    );
    this.kikLotteryContractRpc = await this.getKikLotteryContract(
      this.web3Infura
    );
    this.connectedRpc = true;
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

  async getKikLotteryContract(web3) {
    if (kikLotteryAddress) {
      const contract = await new web3.eth.Contract(
        kickLotteryAbi,
        kikLotteryAddress
      );
      return contract;
    } else {
      return undefined;
    }
  }

  async getERC20BurnableContract(web3) {
    if (erc20burnableAddress) {
      const contract = await new web3.eth.Contract(
        erc20burnableAbi,
        erc20burnableAddress
      );
      return contract;
    } else {
      return undefined;
    }
  }

  async approve(amount, callback = () => {}) {
    if (this.connected) {
      await this.erc20BurnableContract.methods
        .approve(kikLotteryAddress, amount)
        .send({ from: this.accountAddress }, (err, result) => {
          callback(result);
        });
    } else {
      this.connect(() => {
        this.approve(amount);
      });
    }
  }

  async play(amount, callback = () => {}) {
    await this.kikLotteryContract.methods
      .play(amount)
      .send({ from: this.accountAddress }, (err, result) => {
        callback(result);
      });
  }

  getAllowance() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        this.erc20BurnableContractRpc.methods
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
      if (this.connectedRpc) {
        this.kikLotteryContractRpc.methods.Jackpot().call((err, res) => {
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
      if (this.connectedRpc) {
        this.kikLotteryContractRpc.methods.RoundNumber().call((err, res) => {
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
      if (this.connectedRpc) {
        this.kikLotteryContractRpc.methods
          .History(roundNumber)
          .call((err, res) => {
            if (err) {
              reject(err);
            }
            resolve(res);
          });
      } else {
        resolve('');
      }
    });
  }

  getHistoryArray() {
    return new Promise((resolve, reject) => {
      if (this.connectedRpc) {
        this.kikLotteryContractRpc.methods.getHistory().call((err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        });
      }
    });
  }

  getWinnersArray() {
    return new Promise((resolve, reject) => {
      if (this.connectedRpc) {
        this.kikLotteryContractRpc.methods.getHistory().call((err, res) => {
          if (err) {
            reject(err);
          }
          const winnersArray = res.filter((player) => player.IsWinner);
          resolve(winnersArray);
        });
      }
    });
  }

  getBestLottery() {
    return new Promise((resolve, reject) => {
      if (this.connectedRpc) {
        this.kikLotteryContractRpc.methods
          .getHistory()
          .call(async (err, res) => {
            if (err) {
              reject(err);
            }
            let bestLottery = 0;
            let bestLotteryIndex = 0;
            for (let i = 0; i < res.length; i++) {
              if (Number(bestLottery) < Number(res[i].Jackpot)) {
                bestLottery = await res[i].Jackpot;
                bestLotteryIndex = i;
              }
            }
            resolve(res[bestLotteryIndex]);
          });
      }
    });
  }

  async connect(callback = () => {}) {
    if (!this.connected) {
      const providerOptions = {
        mewconnect: {
          package: MewConnect,
          options: {
            infuraId: '1fa62a71dee94d9ebc1fc18e82207e55',
          },
        },
        frame: {
          package: ethProvider,
        },
        authereum: {
          package: Authereum,
        },
      };
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
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
              this.erc20BurnableContract = await this.getERC20BurnableContract(
                this.web3
              );
              this.kikLotteryContract = await this.getKikLotteryContract(
                this.web3
              );
              callback({
                address: this.accountAddress,
                success: true,
              });
            });
          });
        })
        .catch(() => {
          callback({ address: null, success: false });
        });
    } else {
      this.networkName = await this.web3.eth.net.getNetworkType();
      callback({ address: this.accountAddress, success: true });
    }
  }

  spliceAddress(address) {
    return address.substr(0, 5) + '..' + address.substr(address.length - 4, 4);
  }
}
export default Bia;
