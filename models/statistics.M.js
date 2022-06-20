// SUPPORT DATA AND FUNCTIONS
/*
Abbreviations:
+ freq: frequency
*/

// Data
const {vn_word_data, en_word_data, tmp1, tmp2} = require('../connect');

/**
 * Return word_data of the chosen language.
 * @param {string} lang 'vn' - vietnemese or 'en' - english
 */
 function chooseLang(lang){
    var word_data = vn_word_data;
    if(lang == 'en'){
        word_data = en_word_data;
    }
    return word_data;
}

/**
 * Count the number of all words have the same POS tag with input tag. If POS tag is empty then count all words.
 * @param {object} word_data 
 * @param {string} pos 
 * @returns frequency of words { word: count }
 */
function countWords(word_data, pos){
    var lexical = new Set();
    var freq_words = {};
    for(let id_word in word_data){
        var word = String(word_data[id_word].word).toLowerCase();
        if(pos == '' || (pos != '' && word_data[id_word].pos == pos)){
            if(!lexical.has(word)){
                lexical.add(word);
                freq_words[word] = 1;
            }else{
                freq_words[word] = freq_words[word] + 1;
            }
        }
    }
    return freq_words;
}

/**
 * Do a statistics based on words and their frequencies.
 * @param {object} freq_words object {word : frequency}
 * @returns statistics { word : { count, percent, F } }. F = -log(percent)
 */
function doStatistics(freq_words){
    var sum_count = 0;
    var statistics = [];
    for(let word in freq_words){
        sum_count += freq_words[word];
    }
    for(let word in freq_words){
        var count = freq_words[word];
        var percent = Number(count / sum_count).toFixed(6);
        var F = - Math.log(percent).toFixed(6);
        statistics.push({word, count, percent, F});
    }
    statistics.sort(function(a,b){
        if(a.count > b.count) return -1;
        if(a.count < b.count) return 1;
        return 0;
    });
    return statistics;
}
// END SUPPORT DATA

// STATISTICS MODEL
/**
 * Model which manages statistics page data.
 * + Each item of data is {word, count, percent, F = -log(n/N)}
 * + Explain: n is count of that word and N is sum count of all words
 */
class StatisticsModel{
    constructor(){
        this.data = [];
    }
    statistics(lang, pos = ''){
        // Default: pos is empty
        // Choose word_data to work with
        var word_data = chooseLang(lang);
        // Count words' frequncies
        var freq_words = countWords(word_data, pos);
        // Do statistics and store
        var statistics = doStatistics(freq_words);
        this.data = statistics;
    }
}
// END STATISTICS MODEL

// EXPORTS DATA
module.exports = new StatisticsModel();
// END EXPORTING

// TEST
/*
console.log('############################ STATISTICS MODEL TEST:');
var sm = new StatisticsModel();
console.log('############################ Thống kê cho các từ tiếng Việt, mọi nhãn POS');
sm.statistics('vn');
console.log(sm.data);
console.log('############################ Thống kê cho các từ tiếng Anh, nhãn POS = CC');
sm.statistics('en', 'CC');
console.log(sm.data);
*/
