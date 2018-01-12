
import { SampleReactComponent } from "./SampleReactComponent"

console.log ( "Hello from the buildbot-react-plugin-boilerplate!" )

// Register new module
class ReactPluginBoilerplate {
    constructor() {
        return [
            'ui.router',
            'ui.bootstrap',
            'ui.bootstrap.popover',
            'ngAnimate',
            'guanlecoja.ui',
            'bbData'
        ];
    }
}

class ReactPluginBoilerplateConfig {
    constructor($stateProvider, glMenuServiceProvider, bbSettingsServiceProvider, config) {

        // Config object coming in from the master.cfg
        //console.log( "config", config )

        // Name of the state
        const name = 'reactPluginBoilerplate';

        // Menu configuration
        glMenuServiceProvider.addGroup({
            name,
            caption: 'React Plugin Boilerplate',
            icon: 'question-circle',
            order: 0
        });

        // Configuration
        const cfg = {
            group: name,
            caption: 'React Plugin Boilerplate'
        };

        // Register new state
        const state = {
            controller: "reactPluginBoilerplateController",
            controllerAs: "c",
            template: "<div id='reactContent'></div>",
            //templateUrl: `react_plugin_boilerplate/views/${name}.html`,
            name,
            url: "/reactPluginBoilerplate",
            data: cfg
        };

        $stateProvider.state(state);

        // bbSettingsServiceProvider.addSettingsGroup({ 
        //     name: 'reactPluginBoilerplate',
        //     caption: 'React Plugin Boilerplate related settings',
        //     items: [{
        //         type: 'integer',
        //         name: 'buildLimit',
        //         caption: 'Number of builds to fetch',
        //         default_value: 500
        //     }
        //     ]});
    }
}

class ReactPluginBoilerplateController {
    constructor($scope, $element, $q, $window, dataService, bbSettingsService, resultsService,
        $uibModal, $timeout) {
    
        // Find the div.reactContent in the template (note, this is some kind 
        //  of angular data structure, not an actual dom element.
        const reactContentElement = $element.find('#reactContent');
        // This is an actual DOM element that React needs 
        this.reactRawElement = angular.element(reactContentElement).get(0);

        this.dataAccessor = dataService.open().closeOnDestroy($scope)

        this.changeLimit = 30;

        this.changes = this.dataAccessor.getChanges({limit: this.changeLimit, order: '-changeid'})

		this.changes.onChange = () => this.update()
        
        this.renderReact();

    }

    update() {
    	console.log ("Updating React View");

    	// your plugin might do some stuff in here to massage the data into a more
    	//  view-amenable form before calling the render function

    	this.renderReact();
    }

    renderReact() {
	    var props = {changes: this.changes}

        ReactDOM.render(
            React.createElement(SampleReactComponent, props, null),
              this.reactRawElement
        );
	}


}



angular.module('buildbot_react_plugin_boilerplate', new ReactPluginBoilerplate())
.config(['$stateProvider', 'glMenuServiceProvider', 'bbSettingsServiceProvider', 'config', ReactPluginBoilerplateConfig])
.controller('reactPluginBoilerplateController', ['$scope', '$element', '$q', '$window', 'dataService', 'bbSettingsService', 'resultsService', '$uibModal', '$timeout', ReactPluginBoilerplateController]);

