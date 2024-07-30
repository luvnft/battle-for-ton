function checkMobileMode(){
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        let meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
}

function initializeUnityPlayer(canvas, config){
    createUnityInstance(canvas, config, (progress) => { /*...*/ })
        .then((unityInstance) => {
            window.unityGame = unityInstance;
    });
}

function subscribeOnServerResponses(){
    window.addEventListener("message", (event) => {
        console.log("app_id: " + app_id + " - полученные данные:", event);

        let message = event.data.message;
        let receivedData = event.data.data;
        switch (message) {
            case "OnInitResponse":
            case "OnQuestLoadResponse":
            case "OnQuestActionResponse":
            case "OnSetGameDataResponse":
                console.log(message + " - дата:", receivedData);

                let jsonData = JSON.stringify(receivedData);
                window.unityGame.SendMessage("ConnectorUnityToWebGL", message, jsonData);
                break;
            default:
                console.log("Message incorrect: " + message, receivedData);
        }
    });
}

const app_id = "undefined";
const canvas = document.querySelector("#unity-canvas");
const config = {
    arguments: [],
    dataUrl: "Build/Crypto-Proto-Build.data",
    frameworkUrl: "Build/Crypto-Proto-Build.framework.js",
    codeUrl: "Build/Crypto-Proto-Build.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "CryptoMans",
    productName: "Crypto Prototype",
    productVersion: "0.0.1",
};

checkMobileMode();
initializeUnityPlayer(canvas, config);
subscribeOnServerResponses();
