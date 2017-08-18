/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["css/style.css","8a9abe5831d08dcf2d2bc5f77f8db07f"],["dev.html","a3238cb9985325e42edffe56ae739286"],["img/avatar-home.svg","b108dc7a9811e46fecf82f6dba2a23c6"],["img/cablevision-logo.svg","244f12b74a52022bdc3ea6e72c46da5e"],["img/error-connection.svg","151204c4c308b5c2d879a1688f7c1ea5"],["img/facebook-logo.svg","f694158fad878351ca48ebfff62ad05c"],["img/fibertel-logo.svg","167726a4facb3374212c52a61cd1c691"],["img/link.svg","3efbc04c5adbe88519a599e66729b1be"],["img/logos.svg","4900f944a594c4862b028b834645722d"],["img/pagomiscuentas.svg","f5bdce8a5bc82c42c3dbb90e5c0845fd"],["img/pdf.svg","8366a7a2a070e5c29c725aa233ad670e"],["img/rapipago.svg","30c64990ee25d50613efffe9c114b09a"],["img/sucursales.svg","21c2917c38a5e8a8c22f47b96d3cb4e7"],["img/twitter-logo.svg","94fcbdcb64520eedb6266f9024044294"],["img/visa.svg","30047143c46806f755aa6639426e3cd9"],["index.html","085e242ee51ec885aaf4e537f4caa986"],["js/app.js","2be7cd116b11924d463778216347d0e4"],["js/controllers/contactoCtrl.js","d4f9e23194edd8a96d1662253351cd66"],["js/controllers/faqCtrl.js","28cdf7beb50da1c559db235a06f9be1b"],["js/controllers/homeCtrl.js","ce10cec10f0e710679f80746932c8316"],["js/controllers/inboxCtrl.js","068fe67d135fdb9e2d0c4b0a2feb8cd6"],["js/controllers/informacionLegalCtrl.js","84cff17f8b50a65d560f130aa15f02ea"],["js/controllers/loginCtrl.js","3d283ea6298829abc026438a6bd820d3"],["js/controllers/mainCtrl.js","938b71e7645a31b55c95b8744d8224d1"],["js/controllers/mediosDePagoCtrl.js","9e745ce336b6a03c3c8ac28ce4bb9e2f"],["js/controllers/misDatosCtrl.js","67c985c947e448274362537ba18a47c9"],["js/controllers/misFacturasCtrl.js","29188ad4718d4b431fe01bf1627b7a23"],["js/controllers/sucursalesCtrl.js","585cc4a92e5287e544bcb59d117287f7"],["js/controllers/tabsCtrl.js","fc503fbdecf2b5142ea9914b6d7917d9"],["js/controllers/welcomeCtrl.js","01c4f725b9478601d47fcbd033415a46"],["js/service-worker-registration.js","d60f01dc1393cbaaf4f7435339074d5e"],["js/services/contratosService.js","b2b3472b7a4030967c0785290d2ecac3"],["js/services/facturasService.js","0e86765f386eba477ff30f83cfa995d9"],["js/services/faqService.js","7722a82ad65ec65294a09da11b3e5f1c"],["js/services/inboxService.js","39848eaf1ec177eea6013fd2d76ca4e9"],["js/services/loginService.js","1cd19b25c823b29cfa138a7cf632f31c"],["js/services/mapService.js","ab6f3a8f6fa81782000a87824544b0b8"],["js/services/mediosDePagoService.js","e544e31f4ffe76d65d181325ae176707"],["js/services/modelService.js","593a3983220aee2f6e95f7e3702cb3f3"],["js/services/pdfService.js","a078ae56cbcbbcbce0a2909bf7e94932"],["js/services/sucursalesService.js","6f64fe0b4359797dd640a14e8ceb50f5"],["js/services/userService.js","100b519c32ee6ce61ad01257e3738004"],["lib/ionic/css/ionic.css","6cdadf6ed39d5a14994dfd22aab35e44"],["lib/ionic/css/ionic.min.css","69b6aba4f6d47c03b5be1fbd5aed153b"],["lib/ionic/fonts/ionicons.eot","2c2ae068be3b089e0a5b59abb1831550"],["lib/ionic/fonts/ionicons.svg","621bd386841f74e0053cb8e67f8a0604"],["lib/ionic/fonts/ionicons.ttf","24712f6c47821394fba7942fbb52c3b2"],["lib/ionic/fonts/ionicons.woff","05acfdb568b3df49ad31355b19495d4a"],["lib/ionic/js/angular-ui/angular-ui-router.js","1f7fe3573d463743394e98d8b00eb228"],["lib/ionic/js/angular-ui/angular-ui-router.min.js","83f32131b638a8686a43510fbd645b1b"],["lib/ionic/js/angular/angular-animate.js","11974f7151cb3bc9c5d4820756c60d18"],["lib/ionic/js/angular/angular-animate.min.js","abf4748a7ef6bb5b610ecb5ab749afae"],["lib/ionic/js/angular/angular-resource.js","f9e3e662c0698e830be89599d7620e0f"],["lib/ionic/js/angular/angular-resource.min.js","97796a250538882e4d26ddf37e05f208"],["lib/ionic/js/angular/angular-sanitize.js","3327cce34c3af9a2088cbc8fa9d62c84"],["lib/ionic/js/angular/angular-sanitize.min.js","bacfe60d661bf26faa119cebc50c6518"],["lib/ionic/js/angular/angular.js","7ee4960c3fdfa8a88b3b540e19fcf7ff"],["lib/ionic/js/angular/angular.min.js","d2342622316f832ef1333c74e41354ca"],["lib/ionic/js/ionic-angular.js","0323097db585d40eab7a71d414d8d9c0"],["lib/ionic/js/ionic-angular.min.js","c81f119bbecf436bfaa17c28ff3ef095"],["lib/ionic/js/ionic.bundle.min.js","e0cc14dc4c94a45d368932afd38c0614"],["lib/ionic/js/ionic.js","e5455b6c32f086d880d60203df0d9d84"],["lib/ionic/js/ionic.min.js","bbf477571ff58642f262d70a93694f6d"],["lib/ionic/version.json","2230fb053b68d338caf012e86feff1f5"],["lib/ngCordova/bower.json","9e9ba821d015e02d11372305aea6064d"],["lib/ngCordova/dist/ng-cordova-mocks.js","ec6fbfbbeb98f742958c92da24e5cb38"],["lib/ngCordova/dist/ng-cordova-mocks.min.js","22d98961c0a73a0c804defbdf73b2909"],["lib/ngCordova/dist/ng-cordova.js","802e010ecfb854bd9a974353b311bc71"],["lib/ngCordova/dist/ng-cordova.min.js","20f90ed0b973d7548f6888e943c69a4a"],["lib/ngCordova/package.json","5c05bc70e8893c641989f0e0aa792d7e"],["lib/pdfjs/build/pdf.js","58cff21d6f1610a1d09c6d0527532d62"],["lib/pdfjs/build/pdf.min.js","d995894eb2b35c9e14613098320c15e9"],["lib/pdfjs/build/pdf.worker.js","8099a661447d94e73ceaba2101cb4d15"],["lib/pdfjs/build/pdf.worker.min.js","23e7fd18db542c4171aba375dbe619a7"],["lib/pdfjs/web/compatibility.js","758c582a7fd2f30ec9dd8f91803a9882"],["lib/pdfjs/web/debugger.js","806b90bff7e7acad343a70b13ad5da31"],["lib/pdfjs/web/hammer.min.js","15065981497259d972918a646ab771e0"],["lib/pdfjs/web/images/annotation-check.svg","1aac80711a19e2e435ef13aba855901f"],["lib/pdfjs/web/images/annotation-comment.svg","4f3d3d9b61d113ba0d284481d2454af4"],["lib/pdfjs/web/images/annotation-help.svg","6ec1ca7b8aa80a3e10325e74d7998894"],["lib/pdfjs/web/images/annotation-insert.svg","790992abfc5034ed777d4ca8b4865a96"],["lib/pdfjs/web/images/annotation-key.svg","40015bde172203a4ffa880a238d6d779"],["lib/pdfjs/web/images/annotation-newparagraph.svg","bb7062f13b8ce19185fc37ff7dc67566"],["lib/pdfjs/web/images/annotation-noicon.svg","6508f26ea254277f5c0df4ea5ab9f24d"],["lib/pdfjs/web/images/annotation-note.svg","832e3217eb765543d201f3b40005956d"],["lib/pdfjs/web/images/annotation-paragraph.svg","da51c08160d09ff8f5e8e09dc9e042eb"],["lib/pdfjs/web/images/findbarButton-next-rtl.png","d635a5da775d416e415930f5433d829c"],["lib/pdfjs/web/images/findbarButton-next-rtl@2x.png","e6397a5760a891c427998d92a5c65e11"],["lib/pdfjs/web/images/findbarButton-next.png","b425dabab271624e125082f6be17e996"],["lib/pdfjs/web/images/findbarButton-next@2x.png","7f5d17319ccac59c9eec58275e6b4023"],["lib/pdfjs/web/images/findbarButton-previous-rtl.png","b425dabab271624e125082f6be17e996"],["lib/pdfjs/web/images/findbarButton-previous-rtl@2x.png","7f5d17319ccac59c9eec58275e6b4023"],["lib/pdfjs/web/images/findbarButton-previous.png","d635a5da775d416e415930f5433d829c"],["lib/pdfjs/web/images/findbarButton-previous@2x.png","e6397a5760a891c427998d92a5c65e11"],["lib/pdfjs/web/images/loading-icon.gif","faa74e8c61fc64d5edb11613c7eead2c"],["lib/pdfjs/web/images/loading-small.png","9244a600a36f650764a9512791792ec8"],["lib/pdfjs/web/images/loading-small@2x.png","14e5ac73c1ae3f8a1f62556b9634db33"],["lib/pdfjs/web/images/secondaryToolbarButton-documentProperties.png","e81d4e81a94de79e10c236547670eb5a"],["lib/pdfjs/web/images/secondaryToolbarButton-documentProperties@2x.png","0f468066bd65a8d2bc3e7c848069c056"],["lib/pdfjs/web/images/secondaryToolbarButton-firstPage.png","4966f15d1573ee9665ad1115b3a1eb44"],["lib/pdfjs/web/images/secondaryToolbarButton-firstPage@2x.png","2d43ccfa724192addf989be5b45c565f"],["lib/pdfjs/web/images/secondaryToolbarButton-handTool.png","2eac9c669b98ce3c624dba5f46a6b328"],["lib/pdfjs/web/images/secondaryToolbarButton-handTool@2x.png","04d38d1ed2861a6d8fca564324dc27d7"],["lib/pdfjs/web/images/secondaryToolbarButton-lastPage.png","d58e9db0f88f5129cb026d2d6ecca73c"],["lib/pdfjs/web/images/secondaryToolbarButton-lastPage@2x.png","c450b43bcf64b4e4a31c1a040d7964bf"],["lib/pdfjs/web/images/secondaryToolbarButton-rotateCcw.png","9904daadfe637b3a1003ba5274363c5d"],["lib/pdfjs/web/images/secondaryToolbarButton-rotateCcw@2x.png","c89c60ede5edd40d6ba425d35b1c2ba6"],["lib/pdfjs/web/images/secondaryToolbarButton-rotateCw.png","858044220ca467eac1d3d8abec9e0b8c"],["lib/pdfjs/web/images/secondaryToolbarButton-rotateCw@2x.png","9a07c9d66c3d75fbf64d8fc046131fe2"],["lib/pdfjs/web/images/shadow.png","bf677598a57b9539055834af51cf6062"],["lib/pdfjs/web/images/texture.png","58d8e1fc8ea84ee69fc9331c42d9d79a"],["lib/pdfjs/web/images/toolbarButton-bookmark.png","97676ebb2225309ad15ba193f23f7fa8"],["lib/pdfjs/web/images/toolbarButton-bookmark@2x.png","5da7bcfae7b61f069cb91b25920c64c5"],["lib/pdfjs/web/images/toolbarButton-download.png","f20a55dc99268dac130586e52e2b10d6"],["lib/pdfjs/web/images/toolbarButton-download@2x.png","3b56d4b64a3bf24df1c0dbe2dd2f52b2"],["lib/pdfjs/web/images/toolbarButton-menuArrows.png","534a899bbcae1b41e70209cec39ba4dc"],["lib/pdfjs/web/images/toolbarButton-menuArrows@2x.png","211044c3c1f898cc25a872d13f5108f4"],["lib/pdfjs/web/images/toolbarButton-openFile.png","8db4158c49b8a31e311ee501af30566f"],["lib/pdfjs/web/images/toolbarButton-openFile@2x.png","4a27a5e1915518b7fef119007e937c8d"],["lib/pdfjs/web/images/toolbarButton-pageDown-rtl.png","5bfdeb6b844f6cc9fa636ec358a76986"],["lib/pdfjs/web/images/toolbarButton-pageDown-rtl@2x.png","eea2e0da4795a4c3e7a03ba1bf4aca15"],["lib/pdfjs/web/images/toolbarButton-pageDown.png","d86ed7c2ca30e08f7f3b499de2dca107"],["lib/pdfjs/web/images/toolbarButton-pageDown@2x.png","7fdce5fb0a3d1bf9e884cc3b4061d143"],["lib/pdfjs/web/images/toolbarButton-pageUp-rtl.png","6fa884ed046f2885582e80f2164f392f"],["lib/pdfjs/web/images/toolbarButton-pageUp-rtl@2x.png","8b828859a3f2d503c7c4eab8ba1a2fc4"],["lib/pdfjs/web/images/toolbarButton-pageUp.png","c270b41d7a0ff9892ba9ac67d789a841"],["lib/pdfjs/web/images/toolbarButton-pageUp@2x.png","1919a86db02ab08b5ac0ef3cb5e53ff9"],["lib/pdfjs/web/images/toolbarButton-presentationMode.png","fb94ca39aec07d85a29fdb62b0b03b24"],["lib/pdfjs/web/images/toolbarButton-presentationMode@2x.png","6f172f3b9c5b7331531969c68f919945"],["lib/pdfjs/web/images/toolbarButton-print.png","923cfb0f2a944b5a49f99a6901770f71"],["lib/pdfjs/web/images/toolbarButton-print@2x.png","a603c277f9547c2428055e7371fd4d81"],["lib/pdfjs/web/images/toolbarButton-search.png","273cffad049d5b4e1f0a9d7af149e597"],["lib/pdfjs/web/images/toolbarButton-search@2x.png","33358e593e99cfe72ac2e9de6c9f244f"],["lib/pdfjs/web/images/toolbarButton-secondaryToolbarToggle-rtl.png","2f4f9206840c72baef8a402175fbfc45"],["lib/pdfjs/web/images/toolbarButton-secondaryToolbarToggle-rtl@2x.png","773ae955c3570a34012c730181f1bdfd"],["lib/pdfjs/web/images/toolbarButton-secondaryToolbarToggle.png","7af7e96cf59fea4b789db1c5d4636d08"],["lib/pdfjs/web/images/toolbarButton-secondaryToolbarToggle@2x.png","cdac287bc3d5648256e106dcb921c520"],["lib/pdfjs/web/images/toolbarButton-sidebarToggle-rtl.png","4796174bdfd65f1861dc2bea81ce744c"],["lib/pdfjs/web/images/toolbarButton-sidebarToggle-rtl@2x.png","4bdb2eb80c6a6cdcbedbc225bb661c08"],["lib/pdfjs/web/images/toolbarButton-sidebarToggle.png","6c365a103073ff2d8303c68856df0a4e"],["lib/pdfjs/web/images/toolbarButton-sidebarToggle@2x.png","b82384c2cc730c47b2e132eb89e9cec4"],["lib/pdfjs/web/images/toolbarButton-viewAttachments.png","b58498a5ba191146108d60bf1e079592"],["lib/pdfjs/web/images/toolbarButton-viewAttachments@2x.png","75a0be951366dd61af4032b6dff6fcd8"],["lib/pdfjs/web/images/toolbarButton-viewOutline-rtl.png","26e6d0ea3c09f725e9f5d2f91d7f4741"],["lib/pdfjs/web/images/toolbarButton-viewOutline-rtl@2x.png","016d9158111a9dc6104628c0c1149077"],["lib/pdfjs/web/images/toolbarButton-viewOutline.png","2d32348db7b0eca4195bf844551a5c58"],["lib/pdfjs/web/images/toolbarButton-viewOutline@2x.png","9eb0bed2459b8cecb8d435849d7ae75c"],["lib/pdfjs/web/images/toolbarButton-viewThumbnail.png","5ab2c00425ead7f7a0c219385d55bf03"],["lib/pdfjs/web/images/toolbarButton-viewThumbnail@2x.png","cb73ce49462796f625979c80ca835971"],["lib/pdfjs/web/images/toolbarButton-zoomIn.png","1ec009b6c54709afa73d99db10c57039"],["lib/pdfjs/web/images/toolbarButton-zoomIn@2x.png","19aea6e460a160e97ec298448d9f06f9"],["lib/pdfjs/web/images/toolbarButton-zoomOut.png","e1256ccd98a1865848fb957009e6f7a9"],["lib/pdfjs/web/images/toolbarButton-zoomOut@2x.png","cc2a035371ed64c3878f903e05a7fea8"],["lib/pdfjs/web/images/treeitem-collapsed-rtl.png","945042e006fed80b37f396f992854110"],["lib/pdfjs/web/images/treeitem-collapsed-rtl@2x.png","247714e47ee167876a2bc6793c95ab4b"],["lib/pdfjs/web/images/treeitem-collapsed.png","583ca0cee62b36c8972ef6b89967700b"],["lib/pdfjs/web/images/treeitem-collapsed@2x.png","9879163b7a2d0bd390c73174c6e276d5"],["lib/pdfjs/web/images/treeitem-expanded.png","6fd8d469b43811d4d0cbdbc2e3dca116"],["lib/pdfjs/web/images/treeitem-expanded@2x.png","f71c9d5993e2823a1829a454014e0471"],["lib/pdfjs/web/l10n.js","63bde39f580306c507248fd8a45508d6"],["lib/pdfjs/web/viewer.css","4ad05e46f98f354bd3280af203d42bf9"],["lib/pdfjs/web/viewer.html","34188690574ed191eec7ccb7c8c26ce3"],["lib/pdfjs/web/viewer.js","75f404c7b1b1694673849c0040864d88"],["lib/pouchdb/js/pouchdb-5.1.0.min.js","c0df548d28c76a070da598d1f206f783"],["templates/inboxDetail.html","526a07dcaf7b6965ed14c22bfd0692ff"],["templates/informacionLegal.html","5703619bf76fcf920bec536f3807c083"],["templates/login.html","ff269d91f9708c7cfba22f6510a2e8fb"],["templates/mediosDePago.html","392aaf3c41d094c62e15c6e9db554430"],["templates/misDatos.html","b1e539aaf2158bc1a243e540e179cfd0"],["templates/noConnection.html","2eaf1fd2a21082be338d46b16b6e72f9"],["templates/pago-telefonico.html","94027d3e8bac90c27efd1889c50d0804"],["templates/passwordRecover.html","51b276638d814e6ad31c6471f21df88f"],["templates/registration.html","e49cf9bc80b282d84df84702582719ad"],["templates/sucursales.html","c6cab29adba5a1afa5e9253ac2fc8311"],["templates/tab-contacto-tablet.html","e63de5dd51683f3f911a9e1a74b8f9db"],["templates/tab-contacto.html","e72ba096f8907daf417882ed5265050a"],["templates/tab-faq.html","4956a36957b80507c58f61b0ca1cd97c"],["templates/tab-home.html","c78969efcc185b07a542ad12bf0e20b4"],["templates/tab-inbox.html","c2eed81cbbf98cf50874653296a17b1f"],["templates/tab-misFacturas.html","2e3233d45a063c06023ac54e70752139"],["templates/tabs.html","0be8af92fc8f1e6b7dc7c524d0176e72"],["templates/terminosYCondiciones.html","b88cbd0d58e3ba6fc89168915e4c515b"],["templates/welcome.html","c9170f0025d1c635f0394ebc9f0f9e99"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







