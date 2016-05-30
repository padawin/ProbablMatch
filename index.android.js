/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
	AppRegistry,
	ListView,
	Text,
	DatePickerAndroid,
	TouchableWithoutFeedback,
	View
} from 'react-native';

var styles = require('./styles.js');

//views
var views = {
	match: require('./views/match.view.js'),
	matchList: require('./views/matchList.view.js'),
	noMatch: require('./views/noMatch.view.js'),
	matchScore: require('./views/matchScore.view.js'),
	loading: require('./views/loading.view.js'),
	main: require('./views/main.view.js'),
	error: require('./views/error.view.js')
};

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
			return views.error(this.state.error);
		}
		else if (!this.state.loaded) {
			return views.loading();
		}

		var results, nbMatches, date,
			text = 'matches found';

		if (this.state.empty) {
			results = views.noMatch();
		}
		else {
			nbMatches = this.state.dataSource._dataBlob.s1.length;
			if (nbMatches === undefined) {
				nbMatches = 1;
				text = 'match found';
			}

			results = views.matchList(
				nbMatches + ' ' + text,
				this.state.dataSource,
				this.renderMatch.bind(this)
			);
		}

		return views.main(
			this.state.date.toDateString(),
			this.showPicker.bind(this),
			results
		);
	}

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
			match.views.result = views.matchScore(match);
		}
		else {
			match.views.misc = 'Upcoming match';
		}

		return match;
	}

	renderMatch(match) {
		match = this.formatMatch(match);
		return views.match(match);
	}
}

AppRegistry.registerComponent('ProbablTest', () => ProbablTest);
