import React, { useMemo } from "react"
import moment from 'moment';
import Page from "../../components/Page"
import TokenSymbol from "../../components/TokenSymbol";
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';

import { Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import "./Dashboard.css"

import useTreasuryAllocationTimes from "../../hooks/useTreasuryAllocationTimes"
import useCurrentEpoch from "../../hooks/useCurrentEpoch";
import useBombStats from "../../hooks/useBombStats";
import usebShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import useTotalValueLocked from "../../hooks/useTotalValueLocked";
import useCashPriceInEstimatedTWAP from "../../hooks/useCashPriceInEstimatedTWAP";
import useBombFinance from "../../hooks/useBombFinance";
import useTokenBalance from "../../hooks/useTokenBalance";
import useFetchBoardroomAPR from "../../hooks/useFetchBoardroomAPR";
import useTotalStakedOnBoardroom from "../../hooks/useTotalStakedOnBoardroom";
import useEarningsOnBoardroom from "../../hooks/useEarningsOnBoardroom";
import useStakedBalanceOnBoardroom from "../../hooks/useStakedBalanceOnBoardroom";
import useStakedTokenPriceInDollars from "../../hooks/useStakedTokenPriceInDollars";
import useBanks from "../../hooks/useBanks";

import { getDisplayBalance } from '../../utils/formatBalance';

import { Helmet } from "react-helmet"
import CountUp from 'react-countup';
import { roundAndFormatNumber } from '../../0x';
import BombFarm from "./components/BombFarm"
import { createGlobalStyle } from 'styled-components';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'Dashboard'

const Dashboard = () => {
    const [banks] = useBanks();
    const activeBanks = banks.filter((bank) => !bank.finished);
    const { to } = useTreasuryAllocationTimes();
    const currentEpoch = useCurrentEpoch();
    const bombStats = useBombStats();
    const bShareStats = usebShareStats();
    const tBondStats = useBondStats();
    const TVL = useTotalValueLocked();
    const cashStat = useCashPriceInEstimatedTWAP();
    const bombFinance = useBombFinance();
    const bondBalance = useTokenBalance(bombFinance?.BBOND);
    const boardroomAPR = useFetchBoardroomAPR();
    const totalStaked = useTotalStakedOnBoardroom();
    const earnings = useEarningsOnBoardroom();
    const stakedBalance = useStakedBalanceOnBoardroom();
    const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);

    const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
    const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
    const bombPriceInDollars = useMemo(() => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null), [bombStats],);
    const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
    const bShareCirculatingSupply = useMemo(() => (bShareStats ? String(bShareStats.circulatingSupply) : null), [bShareStats],);
    const bSharePriceInDollars = useMemo(() => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null), [bShareStats],);
    const tBondCirculatingSupply = useMemo(() => (tBondStats ? String(tBondStats.circulatingSupply) : null), [tBondStats],);
    const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
    const tBondPriceInDollars = useMemo(() => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null), [tBondStats],);
    const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
    const bSharePriceInBNB = useMemo(() => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null), [bShareStats],);
    const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
    const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
    const tokenPriceInDollars = useMemo(() => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null), [bombStats],);
    const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
    const tokenPriceInDollarsForStake = useMemo(
        () =>
            stakedTokenPriceInDollars
                ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
                : null,
        [stakedTokenPriceInDollars, stakedBalance],
    );

    return (
        <Page>
            <BackgroundImage />
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <div className="section border" >
                <h1 style={{ "color": "white", "textAlign": "center", "textTransform": "capitalize", "fontWeight": 100 }}>Bomb Finance Summary</h1>
                <hr />
                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                    <Table style={{ "width": "auto" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Current Supply</TableCell>
                                <TableCell>Total Supply</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TokenSymbol size={50} symbol="BOMB" />
                                </TableCell>
                                <TableCell>{roundAndFormatNumber(bombCirculatingSupply, 2)}</TableCell>
                                <TableCell>{roundAndFormatNumber(bombTotalSupply, 2)}</TableCell>
                                <TableCell>
                                    ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}<br />
                                    {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC
                                </TableCell>
                                <TableCell>
                                    <img alt="metamask fox" src={MetamaskFox} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TokenSymbol size={50} symbol="BSHARE" />
                                </TableCell>
                                <TableCell>{roundAndFormatNumber(bShareCirculatingSupply, 2)}</TableCell>
                                <TableCell>{roundAndFormatNumber(bShareTotalSupply, 2)}</TableCell>
                                <TableCell>
                                    ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}<br />
                                    {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB
                                </TableCell>
                                <TableCell>
                                    <img alt="metamask fox" src={MetamaskFox} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TokenSymbol size={50} symbol="BBOND" />
                                </TableCell>
                                <TableCell>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</TableCell>
                                <TableCell>{roundAndFormatNumber(tBondTotalSupply, 2)}</TableCell>
                                <TableCell>
                                    ${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}<br />
                                    {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC
                                </TableCell>
                                <TableCell>
                                    <img alt="metamask fox" src={MetamaskFox} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div style={{ "textAlign": "center" }}>
                        <div>
                            <Typography variant="h6">Current Epoch</Typography>
                            <Typography variant="h3">{Number(currentEpoch)}</Typography>
                        </div>
                        <hr />
                        <div style={{ "color": "white" }}>
                            <Typography variant="h2">
                                <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                            </Typography>
                            <Typography variant="h6">Next Epoch in</Typography>
                            <hr />
                            <span>Live TWAP: &nbsp;1.17</span><br />
                            <span>
                                TVL: &nbsp;<CountUp end={TVL} separator="," prefix="$" />
                            </span><br />
                            <span>Last Epoch TWAP: &nbsp;{scalingFactor}</span>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="section border" style={{ "color": "white" }}>
                <div className="row">
                    <div className="col-8">
                        <p style={{ "textAlign": "end" }}>
                            <a style={{ "color": "rgba(158, 230, 255, 1)", "marginRight": "2em" }} href="#">Read Investemnt Strategy</a>
                        </p><br />
                        <button className="investNow">Invest Now</button>
                        <div className="row d-flex justify-content-around mt-3">
                            <button className="col-5 contact">Chat on Discord</button>
                            <button className="col-5 contact">Read Docs</button>
                        </div>
                        <div className="card boardroom border">
                            <div className="row">
                                <div className="col-1">
                                    <TokenSymbol size={50} symbol="BSHARE" />
                                </div>
                                <div className="col">
                                    <p>Boardroom &nbsp;&nbsp;<span>Recommended</span></p>
                                    <p>Stake BSHARE and earn BOMB every epoch</p>
                                </div>
                                <div className="col-3">TVL: &nbsp;{TVL.toFixed(2)}</div>
                            </div>
                            <hr />
                            <p style={{ "textAlign": "right" }}>Total Staked: <TokenSymbol size={30} symbol="BSHARE" />&nbsp;{getDisplayBalance(totalStaked)}</p>
                            <div className="row">
                                <div className="col-2">
                                    <p>Daily Returns:</p>
                                    <strong><h3>{(boardroomAPR / 365).toFixed(2)}%</h3></strong>
                                </div>
                                <div className="col-3">
                                    <p>Your Stake:</p>
                                    <p><TokenSymbol size={30} symbol="BSHARE" />{getDisplayBalance(stakedBalance)}</p>
                                    <p>???&nbsp;${tokenPriceInDollarsForStake}</p>
                                </div>
                                <div className="col-3">
                                    <p>Earned:</p>
                                    <p><TokenSymbol size={30} symbol="BOMB" />{getDisplayBalance(earnings)}</p>
                                    <p>???&nbsp;${earnedInDollars}</p>
                                </div>
                                <div className="col-4">
                                    <div className="row my-2">
                                        <button className="col m-1">Deposit</button>
                                        <button className="col m-1">Withdraw</button>
                                    </div>
                                    <div className="row">
                                        <button className="col">Claim Rewards</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 card border">
                        <div className="card-body">
                            <h5 className="card-title">Latest News</h5>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="section border" style={{ "color": "white" }}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h3>Bomb Farms</h3>
                        <p>Stake your LP tokens in our farms to start earning $BSHARE</p>
                    </div>
                    <button>Claim All &nbsp; <TokenSymbol size={20} symbol="BSHARE" /></button>
                </div>
                <BombFarm symbol="BOMB-BTCB-LP" banks={activeBanks} />
                <hr />
                <BombFarm symbol="BSHARE-BNB-LP" banks={activeBanks} />
            </div>
            <br />
            <div className="section border" style={{ "color": "white" }}>
                <div className="row">
                    <div className="col-1">
                        <TokenSymbol symbol="BBOND" />
                    </div>
                    <div className="col">
                        <h3>Bonds</h3>
                        <p>BBOND can be purchased only on contration periods, when TWAP of BOMB is below 1</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <p>Current Price: (Bomb)^2</p>
                        <h4>BBond = {Number(tBondStats?.tokenInFtm).toFixed(4) || '-'} BTC</h4>
                    </div>
                    <div className="col-3">
                        <p>Available to redeem:</p>
                        <h4><TokenSymbol size={30} symbol="BBOND" />{getDisplayBalance(bondBalance)}</h4>
                    </div>
                    <div className="col-2"></div>
                    <div className="col-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p>Purchase BBond</p>
                                <p>Bomb is over peg</p>
                            </div>
                            <button disabled>Purchase</button>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                            <p>Redeem Bomb</p>
                            <button>Redeem</button>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default Dashboard
