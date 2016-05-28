/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	ListView,
	Text,
	DatePickerAndroid,
	TouchableWithoutFeedback,
	View
} from 'react-native';


var REQUEST_URL = 'http://pads6.pa-sport.com/api/football/competitions/matchDay/{{API_KEY}}/{{DATE}}/json';

class ProbablTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			loaded: false,
			date: new Date()
		};
	}

	componentDidMount() {
		this.fetchData(this.formatDate());
	}

	formatDate() {
		var year, month, day;

		year = this.state.date.getFullYear();
		month = this.state.date.getMonth();
		day = this.state.date.getDate();
		month = (month < 10 ? '0' : '') + (month + 1);
		day = (day < 10 ? '0' : '') + day;

		return '' + year + month + day;
	}

	fetchData(date) {
		var url = REQUEST_URL
			.replace('{{API_KEY}}', 'MYSECRETAPIKEY')
			.replace('{{DATE}}', date);

		fetch(url)
			.then((response) => response.json())
			.then((responseData) => {
				var matches = responseData.matches.match || [];
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(
						matches
					),
					loaded: true,
					empty: matches.length == [],
					date: this.state.date
				});
			})
			.done();
	}

	async showPicker() {
		try {
			const {action, year, month, day} = await DatePickerAndroid.open({
				date: new Date()
			});
			if (action !== DatePickerAndroid.dismissedAction) {
				this.state.date = new Date(year, month, day);
				this.fetchData(this.formatDate());
			}
		} catch ({code, message}) {
			console.warn('Cannot open date picker', message);
		}
	}

	render() {
		if (!this.state.loaded) {
			return this.renderLoadingView();
		}

		var results, date;

		date = this.state.date.toDateString();
		if (this.state.empty) {
			results = <View style={styles.paddedContent}>
				<Text>No match found on the {date}</Text>
			</View>;
		}
		else {
			results = <View>
				<View style={styles.paddedContent}>
					<Text>Matches found for the {date}</Text>
				</View>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderMatch}
					style={styles.listView}
				/>
			</View>;
		}

		return (
			<View>
				<View style={styles.paddedContent}>
					<TouchableWithoutFeedback
						onPress={this.showPicker.bind(this)}
					>
						<View>
							<Text>Click to pick a date</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				{results}
			</View>
		);
	}

	renderLoadingView() {
		return (
			<View style={styles.container}>
				<Text>
					Loading matches...
				</Text>
			</View>
		);
	}

	renderMatch(match) {
		return (
			<View style={styles.container}>
				<View style={styles.rightContainer}>
					<Text style={styles.title}>{match['@matchID']}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	rightContainer: {
		flex: 1
	},
	thumbnail: {
		width: 53,
		height: 81
	},
	title: {
		fontSize: 20,
		marginBottom: 8,
		textAlign: 'center'
	},
	year: {
		textAlign: 'center'
	},
	listView: {
		paddingTop: 20,
		backgroundColor: '#F5FCFF'
	},
	paddedContent: {
		padding: 7
	}
});

AppRegistry.registerComponent('ProbablTest', () => ProbablTest);
