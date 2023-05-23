// const board = require('../data/board.json')
// const templates = require('../data/templete.json')
// const station = require('../data/station.json')
const station = require("../data/station.json");

export const storageService = {
  query,
  get,
  post,
  put,
  remove,
  load,

  // save
};

function query(entityType, delay = 200) {
  var entities = JSON.parse(localStorage.getItem(entityType));
  if (!entities) {
    if (entityType === "Station") {
      entities = station;
      _save("Station", entities);
    } else {
      // entities = templates
      // _save('Template', entities)
    }
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject('OOOOPs')
      // _save(entities)
      resolve(entities);
    }, delay);
  });
  // return Promise.resolve(entities)
}

function get(entityType, entityId) {
  return query(entityType).then((entities) =>
    entities.find((entity) => {
      if (entity._id === entityId) {
        return entity;
      }
    })
  );
}
function post(entityType, newEntity) {
  newEntity._id = _makeId();
  return query(entityType).then((entities) => {
    entities.push(newEntity);
    _save(entityType, entities);
    return newEntity;
  });
}

function put(entityType, updatedEntity) {
  return query(entityType).then((entities) => {
    const idx = entities.findIndex(
      (entity) => entity._id === updatedEntity._id
    );
    entities.splice(idx, 1, updatedEntity);
    _save(entityType, entities);
    return updatedEntity;
  });
}

// function remove(entityType, entityId) {
// 	return query(entityType).then((entities) => {
// 		const idx = entities.findIndex((entity) => entity._id === entityId)
// 		entities.splice(idx, 1)
// 		_save(entityType, entities)
// 	})
// }

function _save(entityType, entities) {
  localStorage.setItem(entityType, JSON.stringify(entities));
}

function _makeId(length = 5) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// function postMany(entityType, newEntities) {
//     return query(entityType)
//         .then(entities => {
//             newEntities = newEntities.map(entity => ({...entity, _id: _makeId()}))
//             entities.push(...newEntities)
//             _save(entityType, entities)
//             return entities
//         })
// }

function load(key) {
  const localUser = JSON.parse(localStorage.getItem(key));
  if (localUser) return localUser;
  else return {};
}

function isExist(key) {
  return !!localStorage.getItem(key);
}

function remove(key) {
  // return localStorage.removeItem(key);
  return localStorage.removeItem("homepageStation");
}
