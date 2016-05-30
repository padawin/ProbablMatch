import React from 'react';
import {
	ListView,
	Text,
	View
} from 'react-native';

var styles = require('../styles.js');

module.exports = function (headerText, dataSource, renderMatchCallback) {
	return (<View>
		<View style={[styles.paddedContent, styles.center]}>
			<Text>{headerText}</Text>
		</View>
		<ListView
			dataSource={dataSource}
			renderRow={renderMatchCallback}
			style={styles.listView}
		/>
	</View>);
};
