import React, { Component } from 'react';
import {
  Alert, Card, CardBody, Col, Container, Row, Spinner,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Markdown } from 'react-showdown';
import numbro from 'numbro';
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import CosmosErrors from '../components/CosmosErrors.jsx';
import Activities from '../components/Activities.jsx';
import { TxIcon } from '../components/Icons.jsx';
import Coin from '/both/utils/coins.js';
import TimeStamp from '../components/TimeStamp.jsx';

const T = i18n.createComponent();
export default class Transaction extends Component {
  constructor(props) {
    super(props);
    const showdown = require('showdown');
    showdown.setFlavor('github');
    const { denom } = this.props;
  }

  render() {
    if (this.props.loading) {
      return (
        <Container id="transaction">
          <Spinner type="grow" color="primary" />
        </Container>
      );
    }

    if (this.props.transactionExist) {
      const tx = this.props.transaction;
      const evts = tx.hasOwnProperty('logs') ? tx.logs[0].events[0] : undefined;
      return (
        <Container id="transaction">
          <Helmet>
            <title>
              Transaction
              {tx.txhash}
              {' '}
              on The Secret Network
            </title>
            <meta name="description" content={`Details of transaction ${tx.txhash}`} />
          </Helmet>
          <h4>
            <T>transactions.transaction</T>
            {' '}
            {(!tx.code) ? <TxIcon valid /> : <TxIcon />}
          </h4>
          {(tx.code) ? (
            <Row>
              <Col xs={{ size: 12, order: 'last' }} className="error">
                <Alert color="danger">
                  <CosmosErrors
                    code={tx.code}
                    logs={tx}
                    gasWanted={tx.gas_wanted}
                    gasUses={tx.gas_used}
                  />
                </Alert>
              </Col>
            </Row>
          ) : ''}
          <Card>
            <div className="card-header">
              <T>common.information</T>
            </div>
            <CardBody>
              <Row>
                <Col md={4} className="label">
                  <T>common.hash</T>
                </Col>
                <Col md={8} className="value text-nowrap overflow-auto address">
                  {tx.txhash}
                </Col>
                <Col md={4} className="label">
                  <T>common.height</T>
                </Col>
                <Col md={8} className="value">
                  <Link to={`/blocks/${tx.height}`}>
                    {numbro(tx.height).format('0,0')}
                  </Link>
                  {tx.block() ? (
                    <span>
                      {' '}
                      <TimeStamp time={tx.block().time} />
                    </span>
                  ) : null}
                </Col>
                <Col md={4} className="label">
                  <T>transactions.fee</T>
                </Col>
                <Col md={8} className="value">
                  {(tx.tx.value.fee.amount.length > 0) ? tx.tx.value.fee.amount.map((fee, i) => (
                    <span className="text-nowrap" key={i}>
                      {' '}
                      {((fee.amount / Meteor.settings.public.stakingFraction) >= 1) ? (new Coin(parseFloat(fee.amount), fee.denom)).stakeString() : (new Coin(parseFloat(fee.amount), fee.denom)).mintString()}
                      {' '}
                    </span>
                  )) : (
                    <span>
                      <T>transactions.noFee</T>
                    </span>
                  )}
                </Col>
                <Col md={4} className="label">
                  <T>transactions.gasUsedWanted</T>
                </Col>
                <Col md={8} className="value">
                  {numbro(tx.gas_used).format('0,0')}
                  {' '}
                  /
                  {' '}
                  {numbro(tx.gas_wanted).format('0,0')}
                </Col>
                <Col md={4} className="label">
                  <T>transactions.memo</T>
                </Col>
                <Col md={8} className="value">
                  <Markdown markup={tx.tx.value.memo} />
                </Col>

              </Row>
            </CardBody>
          </Card>
          <Card>
            <div className="card-header">
              <T>transactions.activities</T>
            </div>
          </Card>
          {(tx.tx.value.msg && tx.tx.value.msg.length > 0) ? tx.tx.value.msg.map((msg, i) => (
            <Card body key={i}>

              <Activities msg={msg} invalid={(!!tx.code)} events={evts} denom={this.denom} />
            </Card>
          )) : ''}
        </Container>
      );
    }

    return (
      <Container id="transaction">
        <div>
          <T>transactions.noTxFound</T>
        </div>
      </Container>
    );
  }
}
