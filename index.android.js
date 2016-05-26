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
			loaded: false
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		var url = REQUEST_URL
			.replace('{{API_KEY}}', 'MYSECRETAPIKEY')
			.replace('{{DATE}}', '20160508');

		fetch(url)
			.then((response) => response.json())
			.then((responseData) => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(
						responseData.matches.match
					),
					loaded: true
				});
			})
			.done();
	}

	render() {
		if (!this.state.loaded) {
			return this.renderLoadingView();
		}

		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this.renderMatch}
				style={styles.listView}
			/>
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
	}
});

AppRegistry.registerComponent('ProbablTest', () => ProbablTest);
