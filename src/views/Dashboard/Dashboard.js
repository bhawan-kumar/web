import React, {useMemo} from "react"
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
import {getDisplayBalance} from '../../utils/formatBalance';

import {Helmet} from "react-helmet"
import CountUp from 'react-countup';
import { roundAndFormatNumber } from '../../0x';

const TITLE = 'Dashboard'
const Dashboard = () => {
    const { to } = useTreasuryAllocationTimes();
    const currentEpoch = useCurrentEpoch();
    const bombStats = useBombStats();
    const bShareStats = usebShareStats();
    const tBondStats = useBondStats();
    const TVL = useTotalValueLocked();
    const cashStat = useCashPriceInEstimatedTWAP();
    const bombFinance = useBombFinance();
    const bondBalance = useTokenBalance(bombFinance?.BBOND);

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

    return (
        <Page> 
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <div style={{"border": "2px solid white"}}>
            <h1 style={{"color": "white", "textAlign": "center", "textTransform": "capitalize", "fontWeight": 100}}>Bomb Finance Summary</h1>
            <hr/>
            <div style={{"display": "flex", "justifyContent": "space-between"}}>
                <Table style={{"width": "auto"}}>
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
                                <TokenSymbol symbol="BOMB" />
                            </TableCell>
                            <TableCell>{roundAndFormatNumber(bombCirculatingSupply, 2)}</TableCell>
                            <TableCell>{roundAndFormatNumber(bombTotalSupply, 2)}</TableCell>
                            <TableCell>
                                ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}<br/> 
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
                                <TokenSymbol symbol="BSHARE" />
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
                                <TokenSymbol symbol="BBOND" />
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
                <div style={{"textAlign": "center"}}>
                    <div>
                        <Typography variant="h6">Current Epoch</Typography>
                        <Typography variant="h3">{Number(currentEpoch)}</Typography>
                    </div>
                    <hr/>
                    <div style={{"color": "white"}}>
                        <Typography variant="h2">
                            <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                        </Typography>
                        <Typography variant="h6">Next Epoch in</Typography>
                        <hr />
                        <span>Live TWAP: &nbsp;1.17</span><br/>
                        <span>
                            TVL: &nbsp;<CountUp  end={TVL} separator="," prefix="$" />
                        </span><br/>
                        <span>Last Epoch TWAP: &nbsp;{scalingFactor}</span>
                    </div>
                </div>
            </div>
            </div>
            <br />
            <div style={{"border": "2px solid white", "color": "white"}}>
                <div className="row">
                    <div className="col-8">
                        <h4>Read Investemnt Strategy</h4>
                        <button>Invest Now</button>
                        <div className="row">
                            <button className="col">Chat on Discord</button>
                            <button className="col">Read Docs</button>
                        </div>
                        <div className="card">
                            <div className="row">
                                <div className="col-1">
                                    <TokenSymbol symbol="BSHARE" />
                                </div>
                                <div className="col">
                                    <p>Boardroom &nbsp;&nbsp;<span>Recommended</span></p>
                                    <p>Stake BSHARE and earn BOMB every epoch</p>
                                </div>
                                <div className="col-3">TVL: &nbsp;1,0008,430</div>
                            </div>
                            <hr />
                            <p style={{"textAlign": "right"}}>Total Staked: <TokenSymbol size={30} symbol="BSHARE"/>&nbsp;7232</p>
                            <div className="row">
                                <div className="col-3">
                                    <p>Daily Returns:</p>
                                    <strong><h3>2%</h3></strong>
                                </div>
                                <div className="col-2">
                                    <p>Your Stake:</p>
                                    <p><TokenSymbol size={30} symbol="BSHARE"/> 6.000</p>
                                    <p>≈&nbsp;$1171.62</p>
                                </div>
                                <div className="col-3">
                                    <p>Earned:</p>
                                    <p><TokenSymbol size={30} symbol="BOMB"/>1660.4413</p>
                                    <p>≈&nbsp;$298.88</p>
                                </div>
                                <div className="col-4">
                                    <div className="row">
                                        <button className="col">Deposit</button>
                                        <button className="col">Withdraw</button>
                                    </div>
                                    <div className="row">
                                        <button className="col">Claim Rewards</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 card">
                        <div className="card-body">
                            <h5 className="card-title">Latest News</h5>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <div style={{"border": "2px solid white", "color": "white"}}>
                <div className="d-flex justify-content-between">
                    <div>
                        <h3>Bomb Farms</h3>
                        <p>Stake your LP tokens in our farms to start earning $BSHARE</p>
                    </div>
                    <button>Claim All &nbsp; <TokenSymbol size={20} symbol="BSHARE" /></button>
                </div>
                <div className="row">
                    <div className="col-1"><TokenSymbol size={50} symbol="BOMB-BTCB-LP" /></div>
                    <p className="col">BOMB-BTCB &nbsp;&nbsp;<span>Recommended</span></p>
                    <div className="col-2">TVL: $1,008,430</div>
                </div>
                <hr />
                <div className="row">
                    <div className="row col-5">
                        <div className="col-4">
                            <p>Daily Returns:</p>
                            <strong><h3>2%</h3></strong>
                        </div>
                        <div className="col-4">
                            <p>Your Stake:</p>
                            <p><TokenSymbol size={30} symbol="BSHARE"/> 6.000</p>
                            <p>≈&nbsp;$1171.62</p>
                        </div>
                        <div className="col-4">
                            <p>Earned:</p>
                            <p><TokenSymbol size={30} symbol="BOMB"/>1660.4413</p>
                            <p>≈&nbsp;$298.88</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-end col" style={{"textAlign": "end"}}>
                        <button >Deposit</button>
                        <button >Withdraw</button>
                        <button >Claim Rewards <TokenSymbol size={20} symbol="BSHARE" /></button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-1"><TokenSymbol size={50} symbol="BOMB-BNB-LP" /></div>
                    <p className="col">BSHARE-BNB &nbsp;&nbsp;<span>Recommended</span></p>
                    <div className="col-2">TVL: $1,008,430</div>
                </div>
                <hr />
                <div className="row">
                    <div className="row col-5">
                        <div className="col-4">
                            <p>Daily Returns:</p>
                            <strong><h3>2%</h3></strong>
                        </div>
                        <div className="col-4">
                            <p>Your Stake:</p>
                            <p><TokenSymbol size={30} symbol="BSHARE"/> 6.000</p>
                            <p>≈&nbsp;$1171.62</p>
                        </div>
                        <div className="col-4">
                            <p>Earned:</p>
                            <p><TokenSymbol size={30} symbol="BOMB"/>1660.4413</p>
                            <p>≈&nbsp;$298.88</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-end col" style={{"textAlign": "end"}}>
                        <button >Deposit</button>
                        <button >Withdraw</button>
                        <button >Claim Rewards <TokenSymbol size={20} symbol="BSHARE" /></button>
                    </div>
                </div>
            </div>
            <br />
            <div style={{"border": "2px solid white", "color": "white"}}>
                <div className="row">
                    <div className="col-1">
                        <TokenSymbol symbol="BBOND"/>
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
