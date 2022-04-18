'use strict';

const {Firestore} = require('@google-cloud/firestore');

const db = new Firestore();
const collection = 'Docs';

async function list(limit, token) {
  const snapshot = await db
    .collection(collection)
    .orderBy('title')
    .startAfter(token || '')
    .limit(limit)
    .get();

  if (snapshot.empty) {
    return {
      books: [],
      nextPageToken: false,
    };
  }
  const docs = [];
  snapshot.forEach((doc) => {
    let book = doc.data();
    book.id = doc.id;
    docs.push(book);
  });
  const q = await snapshot.query.offset(limit).get();

  return {
    books: docs,
    nextPageToken: q.empty ? false : docs[docs.length - 1].title,
  };
}

async function update(id, data) {
  let ref;
  if (id === null) {
    ref = db.collection(collection).doc();
  } else {
    ref = db.collection(collection).doc(id);
  }

  data.id = ref.id;
  data = {...data};
  await ref.set(data);
  return data;
}

async function create(data) {
  return await update(null, data);
}

async function read(id) {
  const doc = await db.collection(collection).doc(id).get();

  if (!doc.exists) {
    throw new Error('No such document!');
  }
  return doc.data();
}

async function _delete(id) {
  await db.collection(collection).doc(id).delete();
}

module.exports = {
  create,
  read,
  update,
  delete: _delete,
  list,
};
