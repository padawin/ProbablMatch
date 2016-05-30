import React from 'react';
import {Text} from 'react-native';
module.exports = function(match) {
	return (<Text>
		{match['homeTeam']['score']}-{match['awayTeam']['score']}
	</Text>);
};
