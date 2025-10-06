import express from 'express'
import axios from 'axios'

const app = express()
const port = 3001

const lat = -29.37908600079284;
const long = -52.10231222614672;



async function getToken() {
    const username = 'zimmerzenatti_vinicius';
    const password = '1sHuDN346daQiNxO4zMN';

    try {
        const response = await axios.get('https://login.meteomatics.com/api/v1/token', {
            auth: {
                username,
                password
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Erro ao obter token:', error.response?.data || error.message);
        return null;
    }
}

app.get('/mapa', async (req, res) => {
    const token = await getToken();

    if (!token) {
        return res.status(500).json({ error: 'Falha ao obter token' });
    }

    const url = `https://api.meteomatics.com/2025-10-04T00:00:00Z/t_2m:C/52.520551,13.461804/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        res.json(resp.data);
    } catch (error) {
        console.error('Erro ao obter dados da Meteomatics:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao consultar API Meteomatics' });
    }
});

app.get('/getTemp', async (req, res) => {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long


    const url = `https://api.meteomatics.com/2025-10-04T12:00:00Z/t_2m:C/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaTemperatura;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        mediaTemperatura = acumulado / tamanho;



        res.json({ mediaTemperatura });

    } catch (error) {
        console.error('Erro ao obter dados da Meteomatics:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao consultar API Meteomatics' });
    }

})

app.get('/getUmi', async (req, res) => {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long


    const url = `https://api.meteomatics.com/2025-10-04T12:00:00Z/relative_humidity_2m:p/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaUmidade;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        mediaUmidade = acumulado / tamanho;



        res.json({ mediaUmidade });

    } catch (error) {
        console.error('Erro ao obter dados da Meteomatics:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao consultar API Meteomatics' });
    }

})

app.get('/getInsiSolar', async (req, res) => {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long


    const url = `https://api.meteomatics.com/2025-10-04T12:00:00Z/global_rad:W/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaInsi;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        acumuladoInsi = acumulado;



        res.json({ mediaInsi });

    } catch (error) {
        console.error('Erro ao obter dados da Meteomatics:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao consultar API Meteomatics' });
    }

})

app.get('/getPreci', async (req, res) => {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long

    const url = `https://api.meteomatics.com/2024-12-04T00:00:00Z--2025-05-05T00:00:00Z:PT24H/precip_24h:mm/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaPrecipitacao;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        mediaPrecipitacao = acumulado / tamanho;



        res.json({ acumulado });

    } catch (error) {
        console.error('Erro ao obter dados da Meteomatics:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao consultar API Meteomatics' });
    }

})


function getMeteomaticsValue(jsonData) {
    try {
        return jsonData?.data?.[0]?.coordinates?.[0]?.dates?.[0]?.value ?? null;
    } catch {
        return null;
    }
}

async function getPreci() {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long

    const url = `https://api.meteomatics.com/2024-12-04T00:00:00Z--2025-05-05T00:00:00Z:PT24H/precip_24h:mm/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaPrecipitacao;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        mediaPrecipitacao = acumulado / tamanho;
        return mediaPrecipitacao;
    }
    catch(error){
        console.log(error)
    }
}

async function getUmi() {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long


    const url = `https://api.meteomatics.com/2025-10-04T12:00:00Z/relative_humidity_2m:p/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaUmidade;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        mediaUmidade = acumulado / tamanho;



        return mediaUmidade;
    }
    catch(error){
        console.log(error)
    }
}

async function getInsi() {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long


    const url = `https://api.meteomatics.com/2025-10-04T12:00:00Z/global_rad:W/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaInsi;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        let acumuladoInsi = acumulado;



        return acumuladoInsi;
    }
    catch(error){
        console.log(error)
    }
}

async function getTemp() {
    const token = await getToken();
    //const lat = req.params.lat
    //const long = req.params.long


    const url = `https://api.meteomatics.com/2025-10-04T12:00:00Z/t_2m:C/${lat},${long}/json?access_token=${token}`;

    try {
        const resp = await axios.get(url);
        const dates = resp.data.data[0].coordinates[0].dates;
        const tamanho = dates.length;
        let mediaTemperatura;
        let acumulado = 0;

        for (let i = 0; i < dates.length; i++) {
            const element = dates[i];
            const valor = element.value;
            acumulado += valor;

        }

        mediaTemperatura = acumulado / tamanho;



        return mediaTemperatura;
    }
    catch(error){
        console.log(error)
    }
}


async function calcularTaxaMilho(qtSementes) {
     // Obtendo os dados médios das funções já configuradas
    const mediaPrecipitacao = await getPreci();
    const mediaUmidade = await getUmi();
    const mediaTemperatura = await getTemp();
    const mediaInsolacao = await getInsi();

    let taxaCrescimento = 1.0; // taxa base = 100%
    
    // -------------------------------
    // 1. Precipitação
    const idealPreci = 400;
    if (mediaPrecipitacao < idealPreci) {
        const diferenca = idealPreci - mediaPrecipitacao;
        // Reduz 1% a cada 10 mm abaixo do ideal
        taxaCrescimento -= (diferenca / 10) * 0.01;
    }
    // Não aumenta se estiver acima do ideal
    // -------------------------------

    // 2. Insolação (Radiação global)
    const idealInsi = 926;
    const margemInsi = 100;
    if (mediaInsolacao < idealInsi - margemInsi) {
        // Para cada 50 W/m² abaixo da margem, reduz 2%
        const diferenca = (idealInsi - margemInsi) - mediaInsolacao;
        taxaCrescimento -= (diferenca / 50) * 0.02;
    } else if (mediaInsolacao > idealInsi + margemInsi) {
        // Se está acima, aumenta 1% a cada 50 W/m², máx. +5%
        const excesso = mediaInsolacao - (idealInsi + margemInsi);
        taxaCrescimento += Math.min((excesso / 50) * 0.01, 0.05);
    }

    // -------------------------------
    // 3. Temperatura
    const tempMin = 26;
    const tempMax = 35;
    if (mediaTemperatura < tempMin) {
        // Reduz 1% a cada grau abaixo de 26
        taxaCrescimento -= ((tempMin - mediaTemperatura) * 0.01);
    } else if (mediaTemperatura > tempMax) {
        // Reduz 1% a cada grau acima de 35
        taxaCrescimento -= ((mediaTemperatura - tempMax) * 0.01);
    }

    // -------------------------------
    // 4. Umidade
    const idealUmi = 70;
    const margemUmi = 10;
    if (mediaUmidade < idealUmi - margemUmi) {
        // Reduz 1% a cada 2% abaixo da margem inferior
        const diferenca = (idealUmi - margemUmi) - mediaUmidade;
        taxaCrescimento -= (diferenca / 2) * 0.01;
    } else if (mediaUmidade > idealUmi + margemUmi) {
        // Aumenta 0.5% a cada 2% acima da margem, máx. +5%
        const excesso = mediaUmidade - (idealUmi + margemUmi);
        taxaCrescimento += Math.min((excesso / 2) * 0.005, 0.05);
    }

    // -------------------------------
    // Limites de segurança
    if (taxaCrescimento < 0) taxaCrescimento = 0;
    if (taxaCrescimento > 1.2) taxaCrescimento = 1.2; // limite +20%

    const prodMilho = (qtSementes * taxaCrescimento).toFixed(0);

    console.log("Taxa de crescimento:", (taxaCrescimento * 100).toFixed(2) + "%");
    console.log("Produção estimada:", prodMilho);
    
    return prodMilho;
}

async function calcularTaxaArroz(qtSementes) {
    // Obtendo os dados médios das funções já configuradas
    const mediaPrecipitacao = await getPreci();
    const mediaUmidade = await getUmi();
    const mediaTemperatura = await getTemp();
    const mediaInsolacao = await getInsi();

    let taxaCrescimento = 1.0; // taxa base = 100%
    
    // -------------------------------
    // 1. Precipitação
    const idealPreci = 1000;
    if (mediaPrecipitacao < idealPreci) {
        const diferenca = idealPreci - mediaPrecipitacao;
        // Reduz 1% a cada 10 mm abaixo do ideal
        taxaCrescimento -= (diferenca / 10) * 0.01;
    }
    // Não aumenta se estiver acima do ideal
    // -------------------------------

    // 2. Insolação (Radiação global)
    const idealInsi = 617;
    const margemInsi = 100;
    if (mediaInsolacao < idealInsi - margemInsi) {
        // Para cada 50 W/m² abaixo da margem, reduz 2%
        const diferenca = (idealInsi - margemInsi) - mediaInsolacao;
        taxaCrescimento -= (diferenca / 50) * 0.02;
    } else if (mediaInsolacao > idealInsi + margemInsi) {
        // Se está acima, aumenta 1% a cada 50 W/m², máx. +5%
        const excesso = mediaInsolacao - (idealInsi + margemInsi);
        taxaCrescimento += Math.min((excesso / 50) * 0.01, 0.05);
    }

    // -------------------------------
    // 3. Temperatura
    const tempIdeal = 30;
    // Reduz 1% a cada grau fora do ideal (abaixo ou acima)
    if (mediaTemperatura < tempIdeal) {
        taxaCrescimento -= (tempIdeal - mediaTemperatura) * 0.01;
    } else if (mediaTemperatura > tempIdeal) {
        taxaCrescimento -= (mediaTemperatura - tempIdeal) * 0.01;
    }

    // -------------------------------
    // 4. Umidade
    const idealUmi = 95;
    const margemUmi = 10;
    if (mediaUmidade < idealUmi - margemUmi) {
        // Reduz 1% a cada 2% abaixo da margem inferior
        const diferenca = (idealUmi - margemUmi) - mediaUmidade;
        taxaCrescimento -= (diferenca / 2) * 0.01;
    } else if (mediaUmidade > idealUmi + margemUmi) {
        // Aumenta 0.5% a cada 2% acima da margem superior, máx. +5%
        const excesso = mediaUmidade - (idealUmi + margemUmi);
        taxaCrescimento += Math.min((excesso / 2) * 0.005, 0.05);
    }

    // -------------------------------
    // Limites de segurança
    if (taxaCrescimento < 0) taxaCrescimento = 0;
    if (taxaCrescimento > 1.2) taxaCrescimento = 1.2; // limite +20%

    const prodArroz = (qtSementes * taxaCrescimento).toFixed(0);

    console.log("Taxa de crescimento:", (taxaCrescimento * 100).toFixed(2) + "%");
    console.log("Produção estimada:", prodArroz);
    
    return prodArroz;
}

async function calcularTaxaSoja(qtSementes) {
    // Obtendo os dados médios das funções já configuradas
    const mediaPrecipitacao = await getPreci();
    const mediaUmidade = await getUmi();
    const mediaTemperatura = await getTemp();
    const mediaInsolacao = await getInsi();

    let taxaCrescimento = 1.0; // taxa base = 100%
    
    // -------------------------------
    // 1. Precipitação
    const idealPreci = 600;
    if (mediaPrecipitacao < idealPreci) {
        const diferenca = idealPreci - mediaPrecipitacao;
        // Reduz 1% a cada 10 mm abaixo do ideal
        taxaCrescimento -= (diferenca / 10) * 0.01;
    }
    // Não aumenta se estiver acima do ideal
    // -------------------------------

    // 2. Insolação (Radiação global)
    const idealInsi = 617;
    const margemInsi = 100;
    if (mediaInsolacao < idealInsi - margemInsi) {
        // Para cada 50 W/m² abaixo da margem, reduz 2%
        const diferenca = (idealInsi - margemInsi) - mediaInsolacao;
        taxaCrescimento -= (diferenca / 50) * 0.02;
    } else if (mediaInsolacao > idealInsi + margemInsi) {
        // Se está acima, aumenta 1% a cada 50 W/m², máx. +5%
        const excesso = mediaInsolacao - (idealInsi + margemInsi);
        taxaCrescimento += Math.min((excesso / 50) * 0.01, 0.05);
    }

    // -------------------------------
    // 3. Temperatura
    const tempIdeal = 25;
    // Reduz 1% a cada grau fora do ideal (abaixo ou acima)
    if (mediaTemperatura < tempIdeal) {
        taxaCrescimento -= (tempIdeal - mediaTemperatura) * 0.01;
    } else if (mediaTemperatura > tempIdeal) {
        taxaCrescimento -= (mediaTemperatura - tempIdeal) * 0.01;
    }

    // -------------------------------
    // 4. Umidade
    const idealUmi = 70;
    const margemUmi = 10;
    if (mediaUmidade < idealUmi - margemUmi) {
        // Reduz 1% a cada 2% abaixo da margem inferior
        const diferenca = (idealUmi - margemUmi) - mediaUmidade;
        taxaCrescimento -= (diferenca / 2) * 0.01;
    } else if (mediaUmidade > idealUmi + margemUmi) {
        // Aumenta 0.5% a cada 2% acima da margem superior, máx. +5%
        const excesso = mediaUmidade - (idealUmi + margemUmi);
        taxaCrescimento += Math.min((excesso / 2) * 0.005, 0.05);
    }

    // -------------------------------
    // Limites de segurança
    if (taxaCrescimento < 0) taxaCrescimento = 0;
    if (taxaCrescimento > 1.2) taxaCrescimento = 1.2; // limite +20%

    const prodSoja = (qtSementes * taxaCrescimento).toFixed(0);

    console.log("Taxa de crescimento:", (taxaCrescimento * 100).toFixed(2) + "%");
    console.log("Produção estimada:", prodSoja);
    
    return prodSoja;
}

async function calcularTaxaTrigo(qtSementes) {
    // Obtendo os dados médios das funções já configuradas
    const mediaPrecipitacao = await getPreci();
    const mediaUmidade = await getUmi();
    const mediaTemperatura = await getTemp();
    const mediaInsolacao = await getInsi();

    let taxaCrescimento = 1.0; // taxa base = 100%
    
    // -------------------------------
    // 1. Precipitação
    const idealPreci = 350;
    if (mediaPrecipitacao < idealPreci) {
        const diferenca = idealPreci - mediaPrecipitacao;
        // Reduz 1% a cada 10 mm abaixo do ideal
        taxaCrescimento -= (diferenca / 10) * 0.01;
    }
    // Não aumenta se estiver acima do ideal
    // -------------------------------

    // 2. Insolação (Radiação global)
    const idealInsi = 794;
    const margemInsi = 100;
    if (mediaInsolacao < idealInsi - margemInsi) {
        // Para cada 50 W/m² abaixo da margem, reduz 2%
        const diferenca = (idealInsi - margemInsi) - mediaInsolacao;
        taxaCrescimento -= (diferenca / 50) * 0.02;
    } else if (mediaInsolacao > idealInsi + margemInsi) {
        // Se está acima, aumenta 1% a cada 50 W/m², máx. +5%
        const excesso = mediaInsolacao - (idealInsi + margemInsi);
        taxaCrescimento += Math.min((excesso / 50) * 0.01, 0.05);
    }

    // -------------------------------
    // 3. Temperatura
    const tempIdeal = 14;
    // Reduz 1% a cada grau fora do ideal (abaixo ou acima)
    if (mediaTemperatura < tempIdeal) {
        taxaCrescimento -= (tempIdeal - mediaTemperatura) * 0.01;
    } else if (mediaTemperatura > tempIdeal) {
        taxaCrescimento -= (mediaTemperatura - tempIdeal) * 0.01;
    }

    // -------------------------------
    // 4. Umidade
    const idealUmi = 70;
    const margemUmi = 10;
    if (mediaUmidade < idealUmi - margemUmi) {
        // Reduz 1% a cada 2% abaixo da margem inferior
        const diferenca = (idealUmi - margemUmi) - mediaUmidade;
        taxaCrescimento -= (diferenca / 2) * 0.01;
    } else if (mediaUmidade > idealUmi + margemUmi) {
        // Aumenta 0.5% a cada 2% acima da margem superior, máx. +5%
        const excesso = mediaUmidade - (idealUmi + margemUmi);
        taxaCrescimento += Math.min((excesso / 2) * 0.005, 0.05);
    }

    // -------------------------------
    // Limites de segurança
    if (taxaCrescimento < 0) taxaCrescimento = 0;
    if (taxaCrescimento > 1.2) taxaCrescimento = 1.2; // limite +20%

    const prodTrigo = (qtSementes * taxaCrescimento).toFixed(0);

    console.log("Taxa de crescimento:", (taxaCrescimento * 100).toFixed(2) + "%");
    console.log("Produção estimada:", prodTrigo);
    
    return prodTrigo;
}


console.log(calcularTaxaSoja(100));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
});
