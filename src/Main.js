import {
    SampleReactComponent
} from "./SampleReactComponent"
import * as React from 'react';
import * as ReactDOM from 'react-dom';

console.log("Hello from the buildbot-react-plugin-boilerplate!")

var module = angular.module('buildbot_react_plugin_boilerplate', ['ui.router',
    'ui.bootstrap',
    'ui.bootstrap.popover',
    'ngAnimate',
    'guanlecoja.ui',
    'bbData'
])
module.config(['$stateProvider', 'glMenuServiceProvider', 'bbSettingsServiceProvider', 'config',
    ($stateProvider, glMenuServiceProvider, bbSettingsServiceProvider, config) => {

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
            template: "<my-react-directive></my-react-directive>",
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
])
module.directive('myReactDirective', ['$q', '$window', 'dataService', 'bbSettingsService', 'resultsService', '$uibModal', '$timeout',
    ($q, $window, dataService, bbSettingsService, resultsService,
        $uibModal, $timeout) => {
        function link(scope, element, attrs) {

            /* create an instance of the data accessor */
            var dataAccessor = dataService.open().closeOnDestroy(scope);

            /* get some changes and put the in the react properties */
            var changes = dataAccessor.getChanges({
                limit: 50,
                order: '-changeid'
            })
            var props = {
                changes: changes
            }
            var react_element = React.createElement(SampleReactComponent, props, null)

            function update() {
                ReactDOM.render(
                    react_element,
                    element.get(0));
            }
            changes.onChange = () => update()
            update()
        }

        return {
            link: link
        };
    }
])
