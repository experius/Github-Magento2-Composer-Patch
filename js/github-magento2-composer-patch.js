// ==UserScript==
// @name         Create copy/pastable composer patch definition for vaimo/composer-patches
// @namespace    http://elgentos.nl/
// @version      1.0.0
// @description  Github Magento 2 - create definition for composer patches
// @author       Peter Jaap Blaakmeer <peterjaap@elgentos.nl>
// @match        https://github.com/*/*/pull/**
// @match        https://github.com/*/*/commit/**
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// ==/UserScript==

jQuery.noConflict();

(function($) {
    'use strict';

    // Add button
    let btn = $('<button>').attr('id', 'patchBtn');

    btn.addClass('composer-patch-creator btn btn-sm');
    btn.append($('<span>').text('View patch JSON'));

    // Append
    $('.gh-header-actions').prepend(btn.clone());
    $('.BtnGroup').prepend(btn.clone());

    $('#patchBtn').on('click', function () {
        let title;
        if ($('.js-issue-title').length) {
            title = $('.js-issue-title').html().trim(); // PR
        } else {
            title = $('.commit-title').html().trim(); // commit
        }

        let patchUrl;
        let issueNumber = $('[name=issue]').val();
        if (typeof issueNumber !== "undefined") {
            patchUrl = "https://patch-diff.githubusercontent.com/raw/magento/magento2/pull/" + issueNumber + ".patch"; // PR
        } else {
            patchUrl = window.location.href + '.patch'; // commit
        }

        let json = {
            "patches": {
                "_comment": "Replace vendor/package with the actual Magento module this patch is for (i.e. magento/module-catalog)",
                "vendor/package": {
                    [title]: {
                        "link": window.location.href,
                        "source": patchUrl,
                        "level": 5,
                        "depends": {
                            "_comment": "Replace the asterisk with the affected Magento version",
                            "magento/product-community-edition": "*"
                        }
                    }
                }
            }
        };

        $('#patchJson').html(JSON.stringify(json,null,2));

        $('#patchDiv').slideToggle();
        $('#patchJson').focus();
        $('#patchJson').select();
    });

    let patchDiv = $('<div>');
    patchDiv.attr('id','patchDiv');
    patchDiv.css('width','100%').css({'margin-bottom':'40px', 'height':'400px','display':'none'});

    let textarea = $('<textarea>').attr('id','patchJson').css({
        'height':'100%',
        'width':'100%',
        'font-size':'8px',
        'padding': '10px',
        'font-family': 'Courier',
        'font-size': '13px'
    });
    patchDiv.html(textarea);

    let info = $('<div>').attr('id','composer-patch-info');
    info.html('This JSON is generated to be used with the <a href="https://github.com/vaimo/composer-patches/" target="_new">vaimo/composer-patches</a> package. <a href="https://github.com/vaimo/composer-patches/blob/master/docs/USAGE_BASIC.md#declaration-patchesjson" target="_new">Readme: Basic usage</a>');
    patchDiv.append(info);
    console.log(patchDiv);

    // PR
    if (window.location.href.indexOf('pull') > 0) {
        $('.tabnav').prepend(patchDiv.clone()); // PR
    } else if ($('.diff-view').length) {
        $('.diff-view').prepend(patchDiv.clone()); // Commit
    }



})(jQuery);
