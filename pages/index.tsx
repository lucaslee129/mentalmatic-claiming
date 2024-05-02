import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import ConnectBtn from '../components/ConnectButton';

const Home: NextPage = () => {
  return (
    <div className="box-sizing justify-center mx-auto w-1/4 mt-[33vh] ">
      <div className="flex justify-center gap-5">
        <ConnectBtn />
      </div>
    </div>
  );
};

export default Home;
