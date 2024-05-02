import { readContract, getAccount } from '@wagmi/core';
import mmtVestContractAbi from '../abi/MMTTokenVest.json';
import getClaimableToken from './getClaimableToken';
require('dotenv').config();

const vestContractAddress = process.env.NEXT_PUBLIC_CURRENTROUNDMMT_CONTRACT;

const GetVestInfo = async () => {
  let buyerAddress: unknown;
  const { address, isConnected } = getAccount();
  if (isConnected) {
    buyerAddress = address;
  }

  const userVestingInfo: any = await readContract({
    address: `0x${vestContractAddress}`,
    abi: mmtVestContractAbi,
    functionName: 'userVesting',
    args: [buyerAddress],
  });

  let claimableToken = await getClaimableToken(
    Number(userVestingInfo[7]),
    Number(userVestingInfo[4]),
    Number(userVestingInfo[5]),
    Number(userVestingInfo[2]),
    Number(userVestingInfo[6])
  );

  const userInfo = {
    reservedMMT: Number(userVestingInfo[0]),
    sentUSDT: Number(userVestingInfo[1]),
    vestedAmount: Number(userVestingInfo[2]),
    startTime: Number(userVestingInfo[3]),
    initialRelease: Number(userVestingInfo[4]),
    monthlyReward: Number(userVestingInfo[5]),
    lastClaimedDate: Number(userVestingInfo[6]),
    claimedToken: Number(userVestingInfo[7]),
    claimableToken: Number(claimableToken),
  };
  return userInfo;
};

export default GetVestInfo;
