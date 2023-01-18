import React, { useMemo } from "react"
import useWallet from "use-wallet"
import styled from 'styled-components';

import useBank from "../../../hooks/useBank"
import useRedeem from "../../../hooks/useRedeem"
import useStatsForPool from "../../../hooks/useStatsForPool"
import useEarnings from "../../../hooks/useEarnings"
import useBombStats from "../../../hooks/useBombStats"
import useShareStats from "../../../hooks/usebShareStats"
import useStakedBalance from "../../../hooks/useStakedBalance"
import useStakedTokenPriceInDollars from "../../../hooks/useStakedTokenPriceInDollars"
import useApprove from "../../../hooks/useApprove"

import TokenSymbol from "../../../components/TokenSymbol"
import PageHeader from '../../../components/PageHeader';
import UnlockWallet from '../../../components/UnlockWallet';
import { getDisplayBalance } from '../../../utils/formatBalance';

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const BankNotFound = () => {
    return (
        <Center>
            <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
        </Center>
    );
};


const BombFarm = ({ symbol, banks }) => {
    const _bank = banks.filter(bank => bank.depositTokenName === symbol)[0]
    const bank = useBank(_bank.contract)
    const { account } = useWallet();
    const { onRedeem } = useRedeem(bank);
    const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);
    let statsOnPool = useStatsForPool(bank);
    const bombStats = useBombStats();
    const tShareStats = useShareStats();
    const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);

    const tokenName = bank.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
    const tokenStats = bank.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
    const tokenPriceInDollars = useMemo(() => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null), [tokenStats],);
    const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

    const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
    const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
    const tokenPriceInDollarsForStake = useMemo(() => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null), [stakedTokenPriceInDollars],);
    const earnedInDollarsForStake = (Number(tokenPriceInDollarsForStake) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))).toFixed(2);

    return account && bank ? (
        <>
            <div className="row">
                <div className="col-1"><TokenSymbol size={50} symbol={symbol} /></div>
                <p className="col">BOMB-BTCB &nbsp;&nbsp;<span>Recommended</span></p>
                <div className="col-2">TVL: ${statsOnPool?.TVL}</div>
            </div>
            <hr />
            <div className="row">
                <div className="row col-5">
                    <div className="col-4">
                        <p>Daily Returns:</p>
                        <strong><h3>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</h3></strong>
                    </div>
                    <div className="col-4">
                        <p>Your Stake:</p>
                        <p><TokenSymbol size={30} symbol="BSHARE" />{getDisplayBalance(stakedBalance, bank.depositToken.decimal)}</p>
                        <p>≈&nbsp;${earnedInDollarsForStake}</p>
                    </div>
                    <div className="col-4">
                        <p>Earned:</p>
                        <p><TokenSymbol size={30} symbol="BOMB" />{getDisplayBalance(earnings)}</p>
                        <p>≈&nbsp;${earnedInDollars}</p>
                    </div>
                </div>
                <div className="d-flex align-items-end justify-content-end col am" style={{ "textAlign": "end" }}>
                    <button style={{ "margin": "5px" }} onClick={approve} >Deposit</button>
                    <button style={{ "margin": "5px" }} onClick={onRedeem}>Withdraw</button>
                    <button style={{ "margin": "5px" }} onClick={onRedeem}>Claim Rewards <TokenSymbol size={20} symbol="BSHARE" /></button>
                </div>
            </div>
        </>
    ) : !bank ? (
        <BankNotFound />
    ) : (
        <UnlockWallet />
    );
}

export default BombFarm
