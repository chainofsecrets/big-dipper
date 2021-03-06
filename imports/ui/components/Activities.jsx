/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js';
import _ from 'lodash';
import Account from './Account.jsx';
import { MsgType } from './MsgType.jsx';

const T = i18n.createComponent();

MultiSend = (props) => (
  <div>
    <p>
      <T>activities.single</T>
      {' '}
      <MsgType type={props.msg.type} />
      {' '}
      <T>activities.happened</T>
    </p>
    <p>
      <T>activities.senders</T>
      <ul>
        {props.msg.value.inputs.map((data, i) => (
          <li key={i}>
            <Account address={data.address} />
            {' '}
            <T>activities.sent</T>
            {' '}
            {data.coins.map((coin, j) => (
              <em key={j} className="text-success">
                {new Coin(coin.amount, coin.denom).toString()}
              </em>
            ))}
          </li>
        ))}
      </ul>
      <T>activities.receivers</T>
      <ul>
        {props.msg.value.outputs.map((data, i) => (
          <li key={i}>
            <Account address={data.address} />
            {' '}
            <T>activities.received</T>
            {' '}
            {data.coins.map((coin, j) => (
              <em key={j} className="text-success">
                {new Coin(coin.amount, coin.denom).toString()}
              </em>
            ))}
          </li>
        ))}
      </ul>
    </p>
  </div>
);

export default class Activites extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props);
    const { msg, events } = this.props;
    switch (msg.type) {
    // bank
    case 'cosmos-sdk/MsgSend':
      let amount = '';
      amount = msg.value.amount.map((coin) => new Coin(coin.amount, coin.denom).toString()).join(', ');
      return (
        <p>
          <Account address={msg.value.from_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <em className="text-success">
            {amount}
          </em>
          {' '}
          <T>activities.to</T>
          {' '}
          <span className="address">
            <Account address={msg.value.to_address} />
          </span>
          <T>common.fullStop</T>
        </p>
      );
    case 'reg/authenticate':
      return (
        <p>
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' from '}
          <Account address={msg.value.sender} />
        </p>
      );
    case 'cosmos-sdk/MsgMultiSend':
      return <MultiSend msg={msg} />;

      // staking
    case 'cosmos-sdk/MsgCreateValidator':
      return (
        <p>
          <Account address={msg.value.delegator_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <T>activities.operatingAt</T>
          {' '}
          <span className="address">
            <Account address={msg.value.validator_address} />
          </span>
          {' '}
          <T>activities.withMoniker</T>
          {' '}
          <Link to="#">
            {msg.value.description.moniker}
          </Link>
          <T>common.fullStop</T>
        </p>
      );
    case 'wasm/store-code':
      return (
        <p>
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' from '}
          <Account address={msg.value.sender} />
            {!(this.props.invalid) ?
                (<>
                  {' code id '}
                  <em className="text-warning">
                    { events.attributes[3].value }
                  </em>
                </>) : null }
        </p>
      );
    case 'wasm/instantiate':
      return (
        <p>
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' from '}
          <Account address={msg.value.sender} />
          {', code id '}
          <em className="text-warning">
            { msg.value.code_id }
          </em>
          {!(this.props.invalid)
            ? (
              <>
                {', label '}
                <em className="text-warning">
                  { msg.value.label }
                </em>
                {', contract address '}
                <Account address={events.attributes[4].value} />
              </>
            ) : null }
        </p>
      );
    case 'wasm/execute':
      return (
        <p>
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' from '}
          <Account address={msg.value.sender} />
          {' to contract address: '}
          <Account address={msg.value.contract} />
          {msg.value.sent_funds.length
            ? (
              <div>
                {' sent funds: '}
                <em className="text-warning">
                  { new Coin(parseInt(msg.value.sent_funds[0].amount, 10) / 100, 'uscrt').toString() }
                </em>
              </div>
            )
            : null}
        </p>
      );
    case 'tokenswap/TokenSwap':
      return (
        <p>
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <em className="text-warning">
            {new Coin(parseInt(msg.value.AmountENG, 10) / 100, 'uscrt').toString()}
          </em>
          {' for '}
          <Account address={msg.value.Receiver} />
          {' '}
          {' | see on  '}
          {!(this.props.invalid) ? (
            <a href={`https://etherscan.io/tx/${msg.value.BurnTxHash}`}>
              {' Etherscan '}
            </a>
          ) : ''}
        </p>
      );

    case 'cosmos-sdk/MsgEditValidator':
      return (
        <p>
          <Account address={msg.value.address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
        </p>
      );
    case 'cosmos-sdk/MsgDelegate':
      return (
        <p>
          <Account address={msg.value.delegator_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <em className="text-warning">
            {new Coin(msg.value.amount.amount, msg.value.amount.denom).toString()}
          </em>
          {' '}
          <T>activities.to</T>
          {' '}
          <Account address={msg.value.validator_address} />
          <T>common.fullStop</T>
        </p>
      );
    case 'cosmos-sdk/MsgUndelegate':
      return (
        <p>
          <Account address={msg.value.delegator_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <em className="text-warning">
            {new Coin(msg.value.amount.amount, msg.value.amount.denom).toString()}
          </em>
          {' '}
          <T>activities.from</T>
          {' '}
          <Account address={msg.value.validator_address} />
          <T>common.fullStop</T>
        </p>
      );
    case 'cosmos-sdk/MsgBeginRedelegate':
      return (
        <p>
          <Account address={msg.value.delegator_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <em className="text-warning">
            {new Coin(msg.value.amount.amount, msg.value.amount.denom).toString()}
          </em>
          {' '}
          <T>activities.from</T>
          {' '}
          <Account address={msg.value.validator_src_address} />
          {' '}
          <T>activities.to</T>
          {' '}
          <Account address={msg.value.validator_dst_address} />
          <T>common.fullStop</T>
        </p>
      );

      // gov
    case 'cosmos-sdk/MsgSubmitProposal':
      const proposalId = _.get(this.props, 'events[2].attributes[0].value', null);
      const proposalLink = proposalId ? `/proposals/${proposalId}` : '#';
      return (
        <p>
          <Account address={msg.value.proposer} />
          {' '}
          <MsgType type={msg.type} />
          {' '}
          <T>activities.withTitle</T>
          {' '}
          <Link to={proposalLink}>
            {msg.value.content.value.title}
          </Link>
          <T>common.fullStop</T>
        </p>
      );
    case 'cosmos-sdk/MsgDeposit':
      return (
        <p>
          <Account address={msg.value.depositor} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <em className="text-info">
            {msg.value.amount.map((amount, i) => new Coin(amount.amount, amount.denom).toString()).join(', ')}
          </em>
          {' '}
          <T>activities.to</T>
          {' '}
          <Link to={`/proposals/${msg.value.proposal_id}`}>
            <T>proposals.proposal</T>
            {' '}
            {msg.value.proposal_id}
          </Link>
          <T>common.fullStop</T>
        </p>
      );
    case 'cosmos-sdk/MsgVote':
      return (
        <p>
          <Account address={msg.value.voter} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <Link to={`/proposals/${msg.value.proposal_id}`}>
            <T>proposals.proposal</T>
            {' '}
            {msg.value.proposal_id}
          </Link>
          {' '}
          <T>activities.withA</T>
          {' '}
          <em className="text-info">
            {msg.value.option}
          </em>
          <T>common.fullStop</T>
        </p>
      );

      // distribution
    case 'cosmos-sdk/MsgWithdrawValidatorCommission':
      return (
        <p>
          <Account address={msg.value.validator_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          <T>common.fullStop</T>
        </p>
      );
    case 'cosmos-sdk/MsgWithdrawDelegationReward':
      return (
        <p>
          <Account address={msg.value.delegator_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          {' '}
          <T>activities.from</T>
          {' '}
          <Account address={msg.value.validator_address} />
          <T>common.fullStop</T>
        </p>
      );
    case 'cosmos-sdk/MsgModifyWithdrawAddress':
      return (
        <p>
          <Account address={msg.value.delegator_address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
        </p>
      );

      // slashing
    case 'cosmos-sdk/MsgUnjail':
      return (
        <p>
          <Account address={msg.value.address} />
          {' '}
          {(this.props.invalid) ? <T>activities.failedTo</T> : ''}
          <MsgType type={msg.type} />
          <T>common.fullStop</T>
        </p>
      );

      // ibc
    case 'cosmos-sdk/IBCTransferMsg':
      return <MsgType type={msg.type} />;
    case 'cosmos-sdk/IBCReceiveMsg':
      return <MsgType type={msg.type} />;

    default:
      return (
        <div>
          {JSON.stringify(msg.value)}
        </div>
      );
    }
  }
}
