import React from 'react';
import {
	Text,
	View
} from 'react-native';
var styles = require('../styles.js');

module.exports = function(error) {
	return (<View style={styles.container}>
		<Text>{error}</Text>
	</View>);
};
