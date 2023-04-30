function init(){
    const codingInit = require("./gpts/coding");
    const chatInit = require("./gpts/normal");
    const roastInit = require("./gpts/roast")
    codingInit();
    chatInit();
    roastInit();
}
module.exports = init;