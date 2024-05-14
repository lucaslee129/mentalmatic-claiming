import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import copy from 'copy-to-clipboard';

import styles from '../styles/Home.module.css';
import ClaimToken from '../utils/ClaimToken';
import GetVestInfo from '../utils/getVestInfo';

const ConnectBtn = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const MonthsOfYear = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const [vestingInfoDisplay, setVestingInfoDisplay] = useState(
    <div className="pr-12 pl-16 justify-stretch text-xl">
      <p className="my-2">Loading...</p>
    </div>
  );
  const [vestingInfo, setVestingInfo] = useState({});
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const func = async () => {
      let vestInfo = await GetVestInfo();
      setVestingInfo(vestInfo);
      const lastClaimedDate = new Date(Number(vestInfo.startTime) * 1000);
      const monthOfClaim = lastClaimedDate.getMonth();
      if (
        Number(vestInfo.reservedMMT) +
          Number(vestInfo.claimedToken) +
          Number(vestInfo.vestedAmount) >
        0
      ) {
        setPurchased(true);
      }
      setVestingInfoDisplay(
        <div className="pr-12 pl-16 w-[500px] justify-stretch text-xl">
          <p className="my-2">
            - Total tokens purchased:{' '}
            {Number(vestInfo.reservedMMT) +
              Number(vestInfo.claimedToken) +
              Number(vestInfo.vestedAmount)}{' '}
            $MMT.
          </p>
          <p className="my-2">
            - Claimable Tokens: {Number(vestInfo.claimableToken)} $MMT.
          </p>
          <p className="my-2">
            - Claimed Tokens: {Number(vestInfo.claimedToken)} $MMT.
          </p>
          <p className="my-2">
            - Unvested Tokens: {Number(vestInfo.reservedMMT)} $MMT.
          </p>
          <p className="my-2">
            - Next token claim date: {lastClaimedDate.getUTCDate()}{' '}
            {MonthsOfYear[monthOfClaim]} {lastClaimedDate.getUTCFullYear()}{' '}
            {lastClaimedDate.getUTCHours().toString().padStart(2, '0')}:
            {lastClaimedDate.getUTCMinutes().toString().padStart(2, '0')}{' '}
            {lastClaimedDate.getUTCHours() / 12 < 1 ? 'am' : 'pm'} UTC
          </p>
        </div>
      );
      const saleStage = Number(process.env.NEXT_PUBLIC_SALESTAGE);
      window.parent.postMessage(saleStage, '*');
    };
    if (isConnected) {
      func();
    }
  }, [isConnected]);

  const handleClaimToken = () => {
    ClaimToken(vestingInfo);
  };

  const handleCopyButtonClicked = () => {
    copy('0x875F5F5A7c8823059E4D2Bd8A8B35a180c2E0e8e');
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className={styles.globals}
          >
            {(() => {
              if (!connected) {
                return (
                  <div className="mt-12">
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className={styles.connect_button}
                    >
                      Connect Wallet to Claim
                    </button>
                  </div>
                );
              }

              if (connected) {
                setIsConnected(true);
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={styles.error_button}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div>
                  <div className="relative flex gap-2 pr-12 pl-16 w-[500px] justify-stretch">
                    <p>
                      <span className="font-bold">
                        Token Contract Address:{' '}
                      </span>{' '}
                      0x875F5F ... E0e8e
                    </p>{' '}
                    <button>
                      <Icon
                        onClick={handleCopyButtonClicked}
                        icon="solar:copy-outline"
                        className="item-center my-auto"
                      />
                    </button>
                    {isCopied && (
                      <div
                        className={`absolute right-2 -top-1 px-6 py-2 text-black text-xs rounded-lg transition-opacity duration-700 ${
                          isCopied ? 'opacity-100' : 'opacity-0'
                        } `}
                        style={{ transition: 'opacity 0.8s' }}
                      >
                        Copied!
                      </div>
                    )}
                  </div>
                  {vestingInfoDisplay}
                  <div
                    className={`${
                      purchased ? 'flex' : 'hidden'
                    } justify-center item-center w-full my-4`}
                  >
                    <button
                      onClick={handleClaimToken}
                      type="button"
                      className={styles.buy_button}
                    >
                      Claim Token
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectBtn;
