import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { Injectable } from '@nestjs/common';
import { Client } from 'amocrm-js';
// import { HttpService } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AmoCRMService {
  private readonly amocrm: Client;

  constructor() {
    // const domain = this.configService.get<string>('AMOCRM_SUBDOMAIN');
    // const clientId = this.configService.get<string>('AMOCRM_CLIENT_ID');
    // const clientSecret = this.configService.get<string>('AMOCRM_CLIENT_SECRET');
    // const redirectUri = this.configService.get<string>('AMOCRM_REDIRECT_URI');

    this.amocrm = new Client({
      domain: 'gafale7819',
      auth: {
        client_id: '825976a7-6720-4df9-a3e7-aa09849ce3de', // ID интеграции
        client_secret: 'rSzqFkZwZfcyCusxfPtQkbFwyuVBb25Wz8Dchj4eSUfHIDHOojdMMWVu3dQO8rT7', // Секретный ключ
        redirect_uri: 'http://vladimir2ht.ddns.net:4000/', // Ссылка для перенаправления
        code: 'def502009c12bea49b56f9a1e7ac75bf400cf658611056615227a8f312e3f20ca15f884e477056bf50112f2d4d9700759fafce53a09f4163e3c194f6825d2420021fa58f1b85f73028c90ce87d4599f0dfb9ad486ffef8a41ba16797c1eac709888c1a2a51a8bc9f7e2f0d33776c297b4bd568db2d4d6ecc0cef0b3519649242a402b12ff80404d07b4c75d3457a7785cf7131823570232839e4cbe3a6f6a844453a1bc755bc54380a3828f529fccf2c4f1ec8098d2abd7fc7eec3614efb3c7959773d25e115a6780bc6d219c45bd6a9d585f114ec75e98c2760fa2fe9fd226440f7cca5ba97137a3b24cf5c0545b9dc54706a82a8bc80cd8e4f3055f3a60ca65aaddbaa6134414919c551a1abc057ef8d402f1327e66a99c186b0a0eaf7479ee03f29c575a1ffd3ea7fa47aaf4b9f9dc32e473bd27415e9e552a2acc7ad41432965e37be5ff0b1bc5dbe407711407d255e6dcf6edc3554941dc4943bbb57a62ae3bed1b35a1e9dd5d4869afac3bdf456f33a05fe923d8b3670baaf0100817d3ed6a2fe5df8efd533a4f1d9ee1c8af865d788f01300f4350a5af13b85470ba3e473b618b7a4392252f9d7190a6d96d73d4eea3a6830159c81feb7cb7ab9829c950aeac4dc298533e1dadc2e4f74c26bf500f296c4c9079946e6ab962c1645a66b4ee65', // Код для упрощённой авторизации, необязательный
        // server: {
        // 	port: 3008
        // }
      },
    });


    // (async () => {
    //   const status = await this.amocrm.connection.connect();
    //   console.log({ status });
    // })();
  
    const updateConnection = async () => {
      if (!this.amocrm.connection.isTokenExpired()) return;
      await this.amocrm.connection.update();
      console.log('t_ref')
    }
    
    // const run = async () => {
    (async () => {
      const filePath = resolve(__dirname, './token.json');
      let renewTimeout: NodeJS.Timeout;
  
      this.amocrm.token.on('change', () => {
        const token = this.amocrm.token.getValue();
        writeFileSync(filePath, JSON.stringify(token));
        
        // обновление токена по истечению
        const expiresIn = token.expires_in * 1000;
  
        clearTimeout(renewTimeout);
        renewTimeout = setTimeout(updateConnection, expiresIn);
      });
  
      try {
        const json = readFileSync(filePath).toString();
        const currentToken = JSON.parse(json);
        this.amocrm.token.setValue(currentToken);
      } catch (e) {
        console.log('ER1', e)
        // Файл не найден, некорректный JSON-токен
      }
    })();
  }

  async getLeads(query: string ) {
    query = (query) ? '/api/v4/leads?name=' + query : '/api/v4/leads';
    return await this.amocrm.request.get(query);
	}  

}