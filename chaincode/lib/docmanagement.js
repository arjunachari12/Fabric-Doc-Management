/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DocManagement extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const docs = [
            {
                docName: 'arjun',
                owner: 'arjun',
                location: 'QmYvs9KCmtNb2taN1D4isjEXs3Z7WJL2D77UgbhYBZUEeZ',    
                path: 'new',            
            }
        ];

        for (let i = 0; i < docs.length; i++) {
            docs[i].docType = 'doc';
            await ctx.stub.putState('DOC' + i, Buffer.from(JSON.stringify(docs[i])));
            console.info('Added <--> ', docs[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

 

    async createDoc(ctx, docNumer, docName, owner, location, path) {
        console.info('============= START : Create Document ===========');

        const doc = {
            docName,
            docType: 'docs',
            owner,
            location,
            path,
        };

        await ctx.stub.putState(docNumer, Buffer.from(JSON.stringify(doc)));
        console.info('============= END : Create Document ===========');
    }

    async queryAllDocument(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryDocument(ctx, docNumer) {
        const docAsBytes = await ctx.stub.getState(docNumer); 
        if (!docAsBytes || docAsBytes.length === 0) {
            throw new Error(`${docNumer} does not exist`);
        }
        console.log(docAsBytes.toString());
        return docAsBytes.toString();
    }
    
    async changeDocOwner(ctx, docNumer, newOwner) {
        console.info('============= START : changeDocOwner ===========');

        const docAsBytes = await ctx.stub.getState(docNumer); 
        if (!docAsBytes || docAsBytes.length === 0) {
            throw new Error(`${docNumer} does not exist`);
        }
        const doc = JSON.parse(docAsBytes.toString());
        doc.owner = newOwner;

        await ctx.stub.putState(docNumer, Buffer.from(JSON.stringify(doc)));
        console.info('============= END : changeDocOwner ===========');
    }

   

    async deleteDoc(ctx, docNumber) {

        await ctx.stub.deleteState(docNumber);
    }
    async getDocHistory(ctx, docNumber) {

        let resultsIterator = await ctx.stub.getHistoryForKey(docNumber);
        let results = await this.GetAllResults(resultsIterator, true);
    
        return JSON.stringify(results);
      }

      async GetAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
          let res = await iterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
            if (isHistory && isHistory === true) {
              jsonRes.TxId = res.value.tx_id;
              jsonRes.Timestamp = res.value.timestamp;
              try {
                jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Value = res.value.value.toString('utf8');
              }
            } else {
              jsonRes.Key = res.value.key;
              try {
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Record = res.value.value.toString('utf8');
              }
            }
            allResults.push(jsonRes);
          }
          if (res.done) {
            await iterator.close();
            return allResults;
          }
        }
      }


}

module.exports = DocManagement;
