#Asegurarse de tener Cordova CLI version >5.
# Ej ejecutar ionic info y validar:
# Cordova CLI: 5.1.1

ionic state clear

cordova platform add android
cordova platform add ios

echo "Agregando Plugins Cordova"

#cordova plugin add cordova-plugin-console
#see http://stackoverflow.com/a/31880322
# https://www.npmjs.com/package/cordova-plugin-console
npm install cordova-plugin-console@1.0.1

cordova plugin add cordova-plugin-whitelist@1.0.0

cordova plugin add cordova-plugin-inappbrowser

cordova plugin add cordova-plugin-splashscreen@3.2.2

cordova plugin add cordova-plugin-network-information

cordova plugin add cordova-plugin-file

cordova plugin add cordova-plugin-x-socialsharing@5.1.3

cordova plugin add ionic-plugin-keyboard@2.2.0

#OneSignal Push Notifications
cordova plugin add onesignal-cordova-plugin@1.12.6

echo "Tiene las keys de ASDRA que andan, HAY QUE CAMBIARLOS"

#Google-Maps: (Tiene las keys de ASDRA que andan, luego las cambiamos)
cordova plugin add https://github.com/snoopconsulting/phonegap-googlemaps-plugin#fef1f886933fd262692a6fd280ac8cc1dbac6680 --variable API_KEY_FOR_ANDROID="AIzaSyCyuVbOKdNu8tEN8S-SxB6gzUtKJVdSHJU" --variable API_KEY_FOR_IOS="AIzaSyBApozpVHl8fu1hcQ4iZVemYISY--ZVTC8"

#Usamos nuestro fork porque agregamos tag merger
cordova plugin add https://github.com/snoopconsulting/google-analytics-plugin#clientes

echo "*************************************************************************************************"
echo "Listado de plugins:"
cordova plugin list

echo "Falta el build! hacer cordova build"
