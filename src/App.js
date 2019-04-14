import React, { Component } from "react";
import web3 from "./web3";
import { Container, Card } from "semantic-ui-react";
import AutoTrader from "./components/AutoTrader";
import CashOut from "./components/CashOut";

class App extends Component {

	//Place as many accounts as you would like to do simultanious trading. Private key is a hard requirement, address is just used for displaying which account is being used on a page.

	state = {
		value: "",
		message: "",
		accounts: [
			{
				"address":"0x0fa86ac12ba377cb1d2ce93111a767b66bf9075a",
				"privateKey": "0x412e995e8dffb51f40125af99b1b6981a7aa08668e948915f4f46035cdb06a65"
			},
			{
				"address":"0x2a4189c8e30a6d0d4c2bfa33e047b76ef5e782ef",
				"privateKey": "0xcef1dc928b224af50b1292d7c8f61077c2c4c87991eea6a6af3506a6381f4962"
			},
			{
				"address":"0xd6bbb37566d3f36e5807e2bc3088579315e9a82d",
				"privateKey": "0xd28448753e00f07cec363a18c0d9068057f9d2c09b6abcf39d9c82dcdd99c12c"
			},
			{
				"address":"0x3a18dabeea1d20c857360be5526a84dd8f0dfd4c",
				"privateKey": "0x5f3e04915dc99ea8139e5f73ee5c616997fd86863f0a2c96633972b4165dd528"
			}
		]
	};

	//Bind our methods
	constructor(props){
		super(props);
		this.buildAutoTraderCards = this.buildAutoTraderCards.bind(this);
		this.buildCashOut = this.buildCashOut.bind(this);

	}

	//Build our page
	render() {
		return (
			<Container>
				<div>
					{this.buildCards()}
					{this.buildAutoTraderCards()}
				</div>
			</Container>
		);
	}

	//Set up auto trader cards
	buildAutoTraderCards(){
		return (
			  <Card.Group>
			{this.state.accounts.map((account, index) => (
			    <Card color="blue" header="Player {index}">
			      <Card.Content>
				<h4>
				       {account.address}
				</h4>
				<AutoTrader
				        account={account}
				        exchangeAddress="0x20011d3F4D0EBa0F9b647fc68DF7CCBdFf291587"
				/>
			      </Card.Content>
			    </Card>
			))}
			  </Card.Group>
		);
	}

	//Set up auto cash-out cards
	buildCashOut(){
		return (
			  <Card.Group>
			{this.state.accounts.map((account, index) => (
			    <Card color="green" header="Player {index}">
			      <Card.Content>
				<h4>
				       {account.address}
				</h4>
				<CashOut
				        account={account}
				        exchangeAddress="0x20011d3F4D0EBa0F9b647fc68DF7CCBdFf291587"
				/>
			      </Card.Content>
			    </Card>
			))}
			  </Card.Group>
		);
	}
}

export default App;
