import axios from "axios";


const BLOCKCYPHER_TOKEN = [
    process.env.BLOCKCYPHER_TOKEN_1,
    process.env.BLOCKCYPHER_TOKEN_2,
    process.env.BLOCKCYPHER_TOKEN_3,
    process.env.BLOCKCYPHER_TOKEN_4,
    process.env.BLOCKCYPHER_TOKEN_5,
];

let currentToken = 0;

export const blockcypherFetch = async (url: string) => {
    let data;

    if (url.includes('undefined'))
        throw new Error('url is undefined');

    try {
        const res = await axios.get(url + `?token=${BLOCKCYPHER_TOKEN[currentToken]}`);
        data = res.data;
    } catch (e) {
        if (e.response.data.error === 'Limits reached.') {
            if (currentToken === BLOCKCYPHER_TOKEN.length - 1)
                throw new Error('Limits reached.');
            else
                currentToken++;

            data = await blockcypherFetch(url);
        }
    }

    return data;
}
