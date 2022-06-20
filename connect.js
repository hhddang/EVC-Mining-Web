// SUPPORT FUNCTIONS
const fs = require('fs');

/**
 * Read data from file that has format: <id_word, word, root, link, _, pos, _, _, _, _>.
 * Return data is object of words, data[id_word] = {word, root, link, pos}.
*/
function getData(file_name){
    var data = {};
    const raw_data = fs.readFileSync(file_name, 'UTF-8');
    const lines = raw_data.split(/\r\n/);    
    lines.forEach((line) => {
        var [id_word, word, root, link, _, pos, _, _, _, _] = line.split('\t');
        link = String(link).split(',');
        for (let i in link){
            link[i] = Number(link[i]);
        }
        data[id_word] = {word, root, link, pos};
    });
    return data;
}

/**
 * Find sententes based on id words, if words have the same id digits form 3 to 8 they belong to one sentence
 * @param {*} word_data : list of words
 * @returns : Return sents is object of sentences, sents[id_sent] = sentence
 */
function getSents(word_data){
    var id_sents = new Set();
    for (let id_word in word_data){
        id_sents.add(id_word.slice(2,8));
    }
    var sents = {};
    for (let id_sent of id_sents){
        var sent = '';
        for (let id_word in word_data){
            if (id_word.slice(2,8) == id_sent)
                sent += word_data[id_word].word + ' ';
        }
        sents[id_sent] = sent;
    }
    return sents;
}
// END SUPPORT FUNCTIONS

// PROCESS AND GET NECESSARY DATA 
const vn_word_data = getData('./corpus/1k_vn.txt');
const en_word_data = getData('./corpus/1k_en.txt');
const vn_sent_data = getSents(vn_word_data);
const en_sent_data = getSents(en_word_data);
// END PROCESSING

// EXPORTS DATA
module.exports = {
    vn_word_data,
    en_word_data,
    vn_sent_data,
    en_sent_data
};
// END EXPORTING
