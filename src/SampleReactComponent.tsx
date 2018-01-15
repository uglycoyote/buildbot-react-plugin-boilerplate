
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import * from '../typings/buildbot'

// // stuff like this should go into some common .d.ts that describes the common data structures
// //   in buildbot so that Typescript can take advantage of this info for auto-completion and 
// //   compile-time checking.
// interface Change {
// 	author : string;
// 	comments : string;
// 	revision : string;
// 	files : string[];
// }

class SampleReactComponentProps {
	changes : Change[];
}

class ChangeRowProps {
	change : Change;
}

export class ChangeRow extends React.Component<ChangeRowProps, any> {

	render() {

		const maxCommentsLength = 512;

		let comments = this.props.change.comments
		if ( comments.length > maxCommentsLength ) {
			comments = comments.substring(0, 512) + "...";
		}


		let files = this.props.change.files.length + " files"

		return <tr key={this.props.change.revision}>
			<td key="revision">
				{this.props.change.revision}
			</td>
			<td key="author">
				{this.props.change.author}
			</td>
			<td key="comments">
				{comments}
			</td>
			<td key="files">
				{files}
			</td>
		</tr>
	}
}

export class SampleReactComponent extends React.Component<SampleReactComponentProps, any> {
  render() { 

  	console.log( "props", this.props );

  	let changeRows = this.props.changes.map( change => {
  		return <ChangeRow key={change.revision} change={change}/>
  	} );

    return <div>
    	<p>Showing {this.props.changes.length} changes:</p>
    	<table>
    		<thead>
    		<tr>
    			<th>Revision</th>
    			<th>Author</th>
    			<th>Description</th>
				<th>Files</th>
			</tr>
    		</thead>
    		<tbody>
	    		{changeRows}
    		</tbody>
    	</table>
	</div>;
  }
}
