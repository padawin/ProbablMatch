import React from 'react';
import {
	Text,
	View
} from 'react-native';

var styles = require('../styles.js');

module.exports = function(match) {
	return (<View style={styles.paddedContent}>
		<View style={styles.container}>
			<View style={styles.half}>
				<Text>{match.date.toDateString()}</Text>
			</View>
			<View style={styles.half}>
				<Text>{match.views.misc}</Text>
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
	</View>);
};
