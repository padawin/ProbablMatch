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
				if (matches.length === undefined) {
					matches = responseData.matches;
				}
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(
						matches
					),
					loaded: true,
					empty: matches.length === 0,
					date: this.state.date
				});
			})
			.catch((error) => {
				this.setState({'error': error.message});
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
		if (this.state.error) {
			return this.renderError(this.state.error);
		}
		else if (!this.state.loaded) {
			return this.renderLoadingView();
		}

		var results, nbMatches,
			text = 'matches found';

		if (this.state.empty) {
			results = this.getNoMatchView();
		}
		else {
			nbMatches = this.state.dataSource._dataBlob.s1.length;
			if (nbMatches === undefined) {
				nbMatches = 1;
				text = 'match found';
			}

			results = this.getMatchesListView(nbMatches + ' ' + text);
		}

		return this.getMainView(results);
	}

	getMatchesListView(headerText) {
		return (<View>
			<View style={[styles.paddedContent, styles.center]}>
				<Text>{headerText}</Text>
			</View>
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this.renderMatch.bind(this)}
				style={styles.listView}
			/>
		</View>);
	}

	getNoMatchView() {
		return (<View style={styles.container}>
			<Text>No match found</Text>
		</View>);
	}

	getMainView(results) {
		var date = this.state.date.toDateString();
		return (
			<View>
				<View style={styles.paddedContent}>
					<TouchableWithoutFeedback
						onPress={this.showPicker.bind(this)}
					>
						<View>
							<Text>{date}</Text>
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

	renderError(error) {
		return (<View style={styles.container}>
			<Text>{error}</Text>
		</View>);
	};

	getWinnerLoser(matchFinished, homeTeam, awayTeam) {
		if (!matchFinished || homeTeam.score === awayTeam.score) {
			return {homeTeam: null, awayTeam: null};
		}
		else if (homeTeam.score > awayTeam.score) {
			return {homeTeam: styles.winner, awayTeam: styles.loser};
		}
		else if (homeTeam.score < awayTeam.score) {
			return {homeTeam: styles.loser, awayTeam: styles.winner};
		}
	}

	formatMatch(match) {
		match.date = match['@date'].split('/');
		match.date = new Date(
			match.date[2],
			parseInt(match.date[1]) - 1,
			match.date[0]
		);
		match.resultTeams = this.getWinnerLoser(
			(match['matchStatus'] === 'FT'),
			match['homeTeam'],
			match['awayTeam']
		);

		match.views = {};
		if (match['matchStatus'] === 'FT'
			|| match['matchStatus'] === 'KO'
		) {
			match.views.result = <Text>
				{match['homeTeam']['score']}-{match['awayTeam']['score']}
			</Text>;
		}
		else {
			match.views.misc = <Text>Upcoming match</Text>
		}

		return match;
	}

	renderMatch(match) {
		match = this.formatMatch(match);

		return (
			<View style={styles.paddedContent}>
				<View style={styles.container}>
					<View style={styles.half}>
						<Text>{match.date.toDateString()}</Text>
					</View>
					<View style={styles.half}>
						{match.views.misc}
					</View>
				</View>
				<View style={styles.container}>
					<View style={styles.third}>
						<Text style={match.resultTeams.homeTeam}>{match['homeTeam']['teamName']}</Text>
					</View>
					<View style={[styles.third, styles.center]}>
						{match.views.result}
					</View>
					<View style={styles.third}>
						<Text style={match.resultTeams.awayTeam}>{match['awayTeam']['teamName']}</Text>
					</View>
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
	center: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	listView: {
		paddingTop: 20,
		backgroundColor: '#F5FCFF'
	},
	paddedContent: {
		padding: 7
	},
	third: {
		flex: .333
	},
	half: {
		flex: .5
	},
	winner: {
		color: 'green'
	},
	loser: {
		color: 'red'
	}
});

AppRegistry.registerComponent('ProbablTest', () => ProbablTest);
