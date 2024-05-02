const getClaimableToken = async (
  claimedToken: number,
  initRelease: number,
  monthlyReward: number,
  vestedAmount: number,
  lastClaimedData: number
) => {
  const VESTING_DURATION = 30 * 24 * 60 * 60;
  const currentTimeInEpoch = Math.floor(Date.now() / 1000);
  const elapsedTime = currentTimeInEpoch - lastClaimedData;
  const periodPassed = Math.floor(elapsedTime / VESTING_DURATION);
  let claimableToken = 0;

  if (claimedToken == 0) {
    claimableToken = initRelease + periodPassed * monthlyReward;
    if (claimableToken >= vestedAmount) {
      claimableToken = vestedAmount;
    }
  } else {
    claimableToken = periodPassed * monthlyReward;
    if (claimableToken >= vestedAmount - claimedToken) {
      claimableToken = vestedAmount - claimedToken;
    }
  }
  return claimableToken;
};

export default getClaimableToken;
