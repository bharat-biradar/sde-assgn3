const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs');

async function processDocument(projectId, location, processorId, filePath, mimeType) {    
    const documentaiClient = new DocumentProcessorServiceClient();
    const resourceName = documentaiClient.processorPath(projectId, location, processorId);
    const imageFile = fs.readFileSync(filePath);
    const encodedImage = Buffer.from(imageFile).toString('base64');
    
    const rawDocument = {
        content: encodedImage,
        mimeType: mimeType,
    };

    const request = {
        name: resourceName,
        rawDocument: rawDocument
    };

    
    const [result] = await documentaiClient.processDocument(request);

    return result.document;
}


async function processDoc(filePath) {
    
    const projectId = 'sde-assgn3';
    const location = 'us'; 
    const processorId = 'f0d14f7c648eeb0e'; 

    mimeType = 'application/pdf';
    const document = await processDocument(
        projectId, location, processorId, filePath, mimeType);
    console.log("Document Processing Complete");

    
    return document;
}

module.exports = {
    processDoc
}


