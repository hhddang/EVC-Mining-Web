// SUPPORT DATA AND FUNCTIONS
/*
Abbreviations (viết tắt):
+ vn: Vietnamese
+ en: English
+ sent: sentence
+ lang: language
+ mat: match / matched (type match / matched word)
+ mor: morphology
+ opp: opposite
 */

// Data
const {vn_word_data, en_word_data, vn_sent_data, en_sent_data} = require('../connect');

/**
 * Return word_data and sent_data of the input language.
 * @param {string} lang 'vn' - vietnemese or 'en' - english
 * @returns [mat_word_data, mat_sent_data, opp_word_data, opp_sent_data]
 */
function chooseLang(lang){
    var [mat_word_data, mat_sent_data, opp_word_data, opp_sent_data] = [vn_word_data, vn_sent_data, en_word_data, en_sent_data];
    if(lang == 'en'){
        [mat_word_data, mat_sent_data, opp_word_data, opp_sent_data] = [en_word_data, en_sent_data, vn_word_data, vn_sent_data];
    }
    return [mat_word_data, mat_sent_data, opp_word_data, opp_sent_data];
}

/**
 * Find the root of the input word if that word has an morph in data, else root is empty.
 * @param {string} word word need to be found root
 * @param {object} word_data data include input word
 * @returns root
 */
function findRoot(word, word_data){
    for(let id_word in word_data){
        if(word_data[id_word].word.toLowerCase() == word.toLowerCase()){
            return word_data[id_word].root;
        }
    }
    return ''
}

/**
 * Find the words that match the requirement.
 * @param {string} type 'mat' - match or 'mor' - morphology
 * @param {string} word word need to be found
 * @param {object} word_data data include input word
 * @returns array of matched words' id
 */
function findMatWord(type, word, word_data){
    var id_words = [];
    // Type morphology: any word in data has the same root with input word is corrected.
    if(type == 'mor'){
        const root = findRoot(word, word_data);
        for(let id_word in word_data){
            if(word_data[id_word].root == root){
                id_words.push(id_word);
            }
        }
    }
    // Type match: any word match with input word is corrected.
    else{
        for(id_word in word_data){
            if(word_data[id_word].word == word){
                id_words.push(id_word);
            }
        }
    }
    // Only get the first word if 2 or more words match and belong to 1 sentece
    for(let id_word1 of id_words){
        for(let id_word2 of id_words){
            if(id_word2.slice(2,8) == id_word1.slice(2,8) && id_word2.slice(8,) > id_word1.slice(8,)){
                id_words.splice(id_words.indexOf(id_word2),1);
            }
        }    
    }
    return id_words;
}

/**
 * Remove id words have incorrect POS.
 * @returns array of matched words' id
 */
function filterPOSTag(pos, id_words, word_data){
    for(let id_word of id_words){
        if(word_data[id_word].pos != pos){
            id_words.splice(id_words.indexOf(id_word),1);
        }
    }
    return mat_id_words
}

/**
 * Find the words of opposite language that align to the matched words.
 * @param {string} lang language of matched words
 * @param {Array} mat_id_words array of matched words' id
 * @param {object} word_data data include input word
 * @returns array of opposite words' id
 */
function findOppWord(lang, mat_id_words, word_data){
    // The matched words only stores opposite word's order (store as link). E.g 1, 2, or 3, a number or many.
    // Must generate opposite id word: opp_id_word = opp_start_symbol + id_sent + order
    var opp_id_words = [];
    // If matched id word is vietnamese then 2 first character of opposite id word is ED, else is VD
    var opp_start_symbol = 'ED'
    if(lang == 'en'){
        opp_start_symbol = 'VD';
    }
    // If that word's link doesn't exist then gererate one with 0
    for(let id_word of mat_id_words){
        var mat_word_link = Number(word_data[id_word].link[0]);
        if(isNaN(mat_word_link)){
            mat_word_link = 0;
        }
        var id_sent = id_word.slice(2,8);
        // Convert link as numer into order as string. Fill with 0 if less than 2 digits
        var order = mat_word_link.toString().padStart(2,0);
        var opposite_id_word = opp_start_symbol + id_sent + order;
        opp_id_words.push(opposite_id_word);
    }
    return opp_id_words;
}

/**
 * Find and split sentences which contain input words. Split them into {left, key, right}.
 * @returns splited sententences [{id, left, key, right}]
 */
function getSplitedSents(id_words, word_data, sent_data){
    var splited_sents = [];
    for(let id_word of id_words){
        var id_sent = id_word.slice(2,8);
        var left, key, right;
        // left and key is empty if that word's order is '00'
        if(id_word.slice(8,) == '00'){
            left = '';
            key = '';
            right = sent_data[id_sent];
        }else{
            key = word_data[id_word].word;
            [left, right] = String(sent_data[id_sent]).split(key);
        }
        var splited_sent = {id: id_sent, left, key, right};
        splited_sents.push(splited_sent);
    }
    return splited_sents;
}
// END OF SUPPORT DATA AND FUNCTIONS


// SEARCH MODEL
/**
 * Model which manages search page data.
 * Stores splited sentences.
 */
class SearchModel{
    constructor(){
        this.mat_splited_sents;
        this.opp_splited_sents;
        this.order_sents = [];
        this.recent_page = 0;
        this.total_sents = 0;
    }
    search(lang, word, type, pos=''){
        // Default: language is vietnamese, type is match, pos is empty
        // Choose language and return data for processing
        var [mat_word_data, mat_sent_data, opp_word_data, opp_sent_data] = chooseLang(lang);
        // Find the words that match the requirement and return their id.
        var mat_id_words = findMatWord(type, word, mat_word_data);
        // If user input POS, remove words incorrect
        if(pos != ''){
            mat_id_words = filterPOSTag(pos, mat_id_words, mat_word_data);
        }
        // Find the words of opposite language that align to the matched words.
        var opp_id_words = findOppWord(lang, mat_id_words, mat_word_data);
        // Find splited sentences of matched words
        var mat_splited_sents = getSplitedSents(mat_id_words, mat_word_data, mat_sent_data);
        // Find splited sentences of opposite words
        var opp_splited_sents = getSplitedSents(opp_id_words, opp_word_data, opp_sent_data);
        // Store splited sentences as model's attribute
        this.mat_splited_sents = mat_splited_sents;
        this.total_sents = this.mat_splited_sents.length;
        this.opp_splited_sents = opp_splited_sents;
        /*
        for(let id_sent in mat_splited_sents){
            this.id_sents.push(id_sent);
        }
        */
    }
    getPage(page){
        var mat_splited_sents = [];
        var opp_splited_sents = [];
        var [start, end] = [1,10];
        start = start + (page - 1) * 10;
        end = end + (page - 1) * 10;
        for (let i = start; i <= end ; i++){
            //var id_sent = this.mat_splited_sents[i-1].id;
            var mat_splited_sent = this.mat_splited_sents[i-1];
            var opp_splited_sent = this.opp_splited_sents[i-1];
            if(mat_splited_sent != undefined && opp_splited_sent != undefined){
                mat_splited_sents.push(mat_splited_sent);
                opp_splited_sents.push(opp_splited_sent);
            }
        }
        this.recent_page = page;
        var total_sents = this.total_sents;
        return {page, mat_splited_sents, opp_splited_sents, total_sents};
    }
}
// END SEARCH MODEL

// EXPORTS DATA
module.exports = new SearchModel();
// END EXPORTING

// TEST
/*
var sm = new SearchModel();
sm.search('vn','được', 'mat')
console.log("############################ Tìm với language VN, type match, word 'được'. Trả về trang 1")
console.log(sm.getPage(1))
sm.search('en','it','mor')
console.log("############################ Tìm với language EN, type morphology, word 'it'. Trả về trang 1")
console.log(sm.getPage(1))
*/
