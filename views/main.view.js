import React from 'react';
import {
	Text,
	TouchableWithoutFeedback,
	View
} from 'react-native';
var styles = require('../styles.js');

module.exports = function(date, datePickerAction, results) {
	return (<View>
		<View style={styles.paddedContent}>
			<TouchableWithoutFeedback
				onPress={datePickerAction}
			>
				<View>
					<Text>{date}</Text>
				</View>
			</TouchableWithoutFeedback>
		</View>
		{results}
	</View>);
};
