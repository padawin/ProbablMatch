import React from 'react';
import {
	Text,
	View
} from 'react-native';
var styles = require('../styles.js');

module.exports = function() {
	return (<View style={styles.container}>
		<Text>
			Loading matches...
		</Text>
	</View>);
};
