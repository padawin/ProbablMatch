import React from 'react';
import {
	Text,
	ScrollView,
	TouchableWithoutFeedback,
	View
} from 'react-native';
var styles = require('../styles.js');

module.exports = function(date, datePickerAction, results) {
	return (<ScrollView
			ref={(scrollView) => { _scrollView = scrollView; }}
			automaticallyAdjustContentInsets={false}
			scrollEventThrottle={200}
			style={styles.scrollView}
	>
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
	</ScrollView>);
};
