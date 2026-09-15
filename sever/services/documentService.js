const documents = new Map();

function saveDocument(id, filename, content) {

    documents.set(id, {
        id,
        filename,
        content,
        createdAt: new Date()
    });

}

function getDocument(id) {

    return documents.get(id);

}

function getAllDocuments() {

    return Array.from(documents.values());

}

function deleteDocument(id) {

    return documents.delete(id);

}

module.exports = {
    saveDocument,
    getDocument,
    getAllDocuments,
    deleteDocument
};