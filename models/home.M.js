// HOME MODEL
/**
 * Model which manages home page data.
 * Stores data of words and sentences.
 */
class HomeModel{
    constructor(){
        const {vn_word_data, en_word_data, vn_sent_data, en_sent_data} = require('../connect');
        this.vn_word_data = vn_word_data;
        this.en_word_data = en_word_data;
        this.vn_sent_data = vn_sent_data;
        this.en_sent_data = en_sent_data;
    }

    /**
     * Return 10 first vietnamese sentences and 10 first english sentences if it's page 1, so on for the next pages.
     * @param {number} page
     */
    getPage(page){
        const id_sents = [1,2,3,4,5,6,7,8,9,10];
        var vn_sents = {};
        var en_sents = {};
        for (let id_sent of id_sents){
            id_sent = id_sent + (page - 1) * 10;
            id_sent = id_sent.toString().padStart(6,'0');
            vn_sents[id_sent] = this.vn_sent_data[id_sent];
            en_sents[id_sent] = this.en_sent_data[id_sent];
        }
        return {vn_sents, en_sents};
    }
    getEntire(){
        var vn_sents = {};
        var en_sents = {};
        for (let id_sent = 1;id_sent<=1600;id_sent++){
            let id = id_sent;
            id = id.toString().padStart(6,'0');
            vn_sents[id] = this.vn_sent_data[id];
            en_sents[id] = this.en_sent_data[id];
        }
        return {vn_sents, en_sents};
    }
    /**
     * Return 2 object of words. Each object represents 1 sentence (vietnamese or english).
     * Each object: sent[order_of_word] = { word, root, link[], pos}
     */
    getPair(id_sent){
        var vn_sent = {};
        var en_sent = {};
        for(let id_word in this.vn_word_data){
            if(id_word.slice(2,8) == id_sent){
                var stt = Number(id_word.slice(8,))
                vn_sent[stt] = this.vn_word_data[id_word]
            }
        }
        for(let id_word in this.en_word_data){
            if(id_word.slice(2,8) == id_sent){
                var stt = Number(id_word.slice(8,))
                en_sent[stt] = this.en_word_data[id_word]
            }
        }
        return {vn_sent, en_sent}
    }
    getVnSentData(){
        return this.vn_sent_data;
    }
    getEnSentData(){
        return this.en_sent_data;
    }
    getVnWordData(){
        return this.vn_word_data;
    }
    getEnWordData(){
        return this.en_word_data;
    }
}
// END HOME MODEL

// EXPORTS DATA
module.exports = new HomeModel();
// END EXPORTING

//TEST
/*
hm = new HomeModel();
var page1 = hm.getPage(1);
var page2 = hm.getPage(2);
var pair5 = hm.getPair('000005')
var pair13 = hm.getPair('000013')
console.log('############################ Trang 1')
console.log(page1)
console.log('############################ Trang 2')
console.log(page2)
console.log('############################ Cặp câu 5')
console.log(pair5)
console.log('############################ Cặp câu 13')
console.log(pair13)
*/
