
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// stuff like this should go into some common .d.ts that describes the common data structures
//   in buildbot so that Typescript can take advantage of this info for auto-completion and 
//   compile-time checking.
interface Change {
	author : string;
	comments : string;
	revision : string;
}

class SampleReactComponentProps {
	changes : Change[];
}

class ChangeRowProps {
	change : Change;
}

export class ChangeRow extends React.Component<ChangeRowProps, any> {

	render() {
		return <tr key={this.props.change.revision}>
			<td key="revision">
				{this.props.change.revision}
			</td>
			<td key="author">
				{this.props.change.author}
			</td>
			<td key="comments">
				{this.props.change.comments}
			</td>
		</tr>
	}
}

export class SampleReactComponent extends React.Component<SampleReactComponentProps, any> {
  render() { 

  	let changeRows = this.props.changes.map( change => {
  		return <ChangeRow key={change.revision} change={change}/>
  	} );

    return <div>
    	<p>Showing {this.props.changes.length} changes:</p>
    	<table>
    		<tbody>
	    		{changeRows}
    		</tbody>
    	</table>
	</div>;
  }
}
