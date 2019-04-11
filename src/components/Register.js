import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import emojiCoin from "../emojiCoin";

export default class Register extends Component {
	state = {
		modalOpen: false,
		value: "",
		message: "",
		errorMessage: "",
		loading: false
	};

	handleOpen = () => this.setState({ modalOpen: true });

	handleClose = () => this.setState({ modalOpen: false });

	constructor(props){
		super(props);
	}


    onSubmit = async event => {
        event.preventDefault();
        this.setState({
		loading: true,
		errorMessage: "",
		message: "waiting for blockchain transaction to complete..."
        });
        try {

		let countnonce = this.state.value;

		while(true){

			this.state.metaAccount = web3.eth.accounts.privateKeyToAccount(this.props.account.privateKey);
			this.state.fromAddress = this.state.metaAccount.address.toLowerCase();


			//Locate my assets
			let coins_o = [];
			let balance_o = [];
			for(let i = 0; i < 8; i++){
				let count = await emojiCoin.methods.emojiBalanceOf(this.state.metaAccount.address,""+i).call({
				        from: this.state.metaAccount.address
				});
				if(count > 0){
					coins_o.push(i);
					balance_o.push(count);
				}
			}


			let TotalBalS = await emojiCoin.methods.balanceOf(this.state.metaAccount.address).call({
				from: this.state.metaAccount.address
			});

			TotalBalS = TotalBalS/1000000000000000000;

			let TotalBal = 0;

			//Sort highest
			let hhIghIndex = 0;
			let hhIghPrice = 0;

			for(let i = 0; i < coins_o.length;i++){
				let count = await emojiCoin.methods.getEmojiPrice(coins_o[i]).call({
				        from: this.state.metaAccount.address
				});
				TotalBal += Number(count) * Number(balance_o[i]);
				if(count > hhIghPrice){
					hhIghIndex = coins_o[i];
					hhIghPrice = count;
				}

			}

			TotalBal = TotalBal * 0.00002005614341339569;

			TotalBalS = Number(TotalBalS)+ Number(TotalBal);
			console.log("Total Assets: $"+TotalBalS);
			let coins = coins_o;

			//Find lowest coin
			let minIndex = 0;
			let minPrice = 99999999999999999999;
			for(let i = 0; i < 8; i++){

				let Price = await emojiCoin.methods.getEmojiPrice(""+i).call({
					from: this.state.metaAccount.address
				});
				if(Price < minPrice){
					minPrice = Price;
					minIndex = i;
				}
			}

			for (let x = 0; x < coins.length; x++){
				let coin = coins[x];
				let Price = await emojiCoin.methods.getEmojiPrice(coin).call({
					from: this.state.metaAccount.address
				});

				if(Price > minPrice){
					countnonce += 1;
					let tx={
						to:this.props.exchangeAddress,
						data: emojiCoin.methods.sellEmoji(hhIghIndex).encodeABI(),
						gas: 6000000,
						gasPrice: Math.round(1 * 1010101010)
					}
					web3.eth.accounts.signTransaction(tx, this.state.metaAccount.privateKey).then(signed => {
						web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt')
					});
				}
			}


			let myBalance = await emojiCoin.methods.balanceOf(this.state.metaAccount.address).call({
				from: this.state.metaAccount.address
			});

			while(Number(myBalance) > 1500000000000000000){

				let tx={
					to:this.props.exchangeAddress,
					data: emojiCoin.methods.buyEmoji(minIndex).encodeABI(),
					gas: 6000000,
					gasPrice: Math.round(1 * 1010101010)
				}

				web3.eth.accounts.signTransaction(tx, this.state.metaAccount.privateKey).then(signed => {
					web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt')
				});

				myBalance = await emojiCoin.methods.balanceOf(this.state.metaAccount.address).call({
					from: this.state.metaAccount.address
				});
				minPrice = 99999999999999999999;
				for(let i = 0; i < 8; i++){
					let Price = await emojiCoin.methods.getEmojiPrice(""+i).call({
						from: this.state.metaAccount.address
					});
					if(Price < minPrice){
						minPrice = Price;
						minIndex = i;
					}
				}

			}
		}

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({
            loading: false,
            message: "Why'd you stop?"
        });
    };

    render() {
        return (
            <Modal
                trigger={
                    <Button color="blue" onClick={this.handleOpen}>
			Start Trading
                    </Button>
                }
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Header icon="browser" content="Trade EmojiCoin" />
                <Modal.Content>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                        <Message error header="Oops!" content={this.state.errorMessage} />
                        <Button primary type="submit" loading={this.state.loading}>
                            <Icon name="check" />
				Start Trading
                        </Button>
                        <hr />
                        <h2>{this.state.message}</h2>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="red" onClick={this.handleClose} inverted>
                        <Icon name="cancel" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
