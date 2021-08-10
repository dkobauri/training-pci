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
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'tpl!pciSampleA/creator/tpl/propertiesForm'
], function(stateFactory, Question, formTpl){
    'use strict';

    var LikertInteractionStateQuestion = stateFactory.extend(Question, function init(){

        //TODO init components to allow editing the question
        console.log('entered question editing state');

    }, function exit(){

        //TODO clear the components initialized me
        console.log('exited question editing state');
    });

    LikertInteractionStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            $form = _widget.$form;

        //render the form using the form template
        $form.html(formTpl());
    };

    return LikertInteractionStateQuestion;
});
