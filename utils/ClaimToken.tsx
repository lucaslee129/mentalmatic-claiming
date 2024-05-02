import {
  sendTransaction,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
  getAccount,
  fetchTransaction,
} from '@wagmi/core';
import mmtVestContractAbi from '../abi/MMTTokenVest.json';
import Notiflix from 'notiflix';
require('dotenv').config();

const vestContractAddress = process.env.NEXT_PUBLIC_CURRENTROUNDMMT_CONTRACT;

const ClaimToken = async (vestingAmount: any) => {
  if (vestingAmount == 0) {
    Notiflix.Notify.failure('Nothing is vested');
  } else {
    let buyerAddress: unknown;
    const { address, isConnected } = getAccount();
    if (isConnected) {
      buyerAddress = address;
    }

    // @desc  Claim Vested MMT Token
    try {
      const { request } = await prepareWriteContract({
        address: `0x${vestContractAddress}`,
        abi: mmtVestContractAbi,
        functionName: 'claimTokens',
      });

      const coineResponse = await writeContract(request);

      await waitForTransaction({
        hash: coineResponse.hash,
      });

      Notiflix.Notify.success('Vested MMT Transfer Success');
    } catch (error: any) {
      const errorMessage = error.message;
      const rejectError = 'User rejected the request.';
      const requireError = 'reverted with the following reason';
      if (errorMessage.includes(rejectError)) {
        Notiflix.Notify.failure('User rejected the request.');
      } else if (errorMessage.includes(requireError)) {
        const errMsg = error.message.match(
          /reverted with the following reason:\n(.*?)\n/
        )[1];
        Notiflix.Notify.failure(errMsg);
      } else {
        console.log(error);
      }
    }
  }
};

export default ClaimToken;
