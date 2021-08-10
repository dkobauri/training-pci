/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 *
 */
define([
    'jquery',
    'lodash',
    'util/url',
    'taoItems/assets/manager',
    'taoItems/assets/strategies',
    'taoQtiItem/portableElementRegistry/assetManager/portableAssetStrategy',
    'taoQtiItem/runner/qtiItemRunner',
    'taoQtiItem/portableElementRegistry/ciRegistry',
    'taoQtiItem/portableElementRegistry/provider/localManifestProvider',
    'text!trainingPci/test/pciSampleA/data/likert_triple/qti.xml'
], function ($, _, url, assetManagerFactory, assetStrategies, portableAssetStrategy, qtiItemRunner, ciRegistry, pciTestProvider, likertTripleXml) {

    'use strict';

    var fixtureContainerId = 'inner-container';
    var outerContainerId = 'outer-container';

    function getAssetManager(baseUrl) {
        return assetManagerFactory([
            assetStrategies.external,
            assetStrategies.baseUrl,
            portableAssetStrategy
        ], {baseUrl: baseUrl || ''});
    }

    function parseXml(xml) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                    url: url.route('getJson', 'Parser', 'taoQtiItem'),
                    type: 'POST',
                    contentType: 'text/xml',
                    dataType: 'json',
                    data: xml
                })
                .done(function (response) {
                    return resolve(response.itemData);
                })
                .fail(function (xhr) {
                    return reject(new Error(xhr.status + ' : ' + xhr.statusText));
                });
        });
    }

    /**
     * manually register the pci from its manifest
     */
    pciTestProvider.addManifestPath('pciSampleA', 'trainingPci/pciCreator/pciSampleA/pciCreator.json');
    ciRegistry.resetProviders();
    ciRegistry.registerProvider(pciTestProvider.getModuleName());

    /**
     * Test if all rendering elements are in place
     */
    QUnit.test('renders correctly', function (assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        parseXml(likertTripleXml).then(function (itemData) {
            var assetManager = getAssetManager('/trainingPci/views/js/test/pciSampleA/data/likert_triple/');
            var runner = qtiItemRunner('qti', itemData, {assetManager: assetManager})
                .on('render', function () {

                    assert.equal($container.children().length, 1, 'the container a elements');
                    assert.equal($container.find('.qti-interaction.qti-customInteraction').length, 1, 'the container contains 3 custom interactions');
                    assert.equal($container.find('.qti-customInteraction .pciSampleA').length, 1, 'the container contains 3 likert interactions');

                    ready();
                    runner.clear();
                })
                .on('error', function (error) {
                    $('#error-display').html(error);
                })
                .init()
                .render($container);
        });
    });

    /**
     * Offer a way to visually test the interaction
     */
    QUnit.test('display and play', function (assert) {
        var ready = assert.async();
        var $container = $('#' + outerContainerId);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        parseXml(likertTripleXml).then(function (itemData) {
            var assetManager = getAssetManager('/trainingPci/views/js/test/pciSampleA/data/likert_triple/');
            qtiItemRunner('qti', itemData, {assetManager: assetManager})
                .on('render', function () {
                    ready();
                })
                .on('error', function (error) {
                    $('#error-display').html(error);
                })
                .init()
                .render($container);
        });
    });

});

