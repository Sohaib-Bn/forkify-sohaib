import { async } from 'regenerator-runtime';
import { TIME_SEC } from './config';

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${sec} seconds`));
    }, sec * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = !uploadData
      ? fetch(url)
      : fetch(url, {
          method: `POST`,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        });

    const res = await Promise.race([fetchPro, timeout(TIME_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteJson = async function (url) {
  try {
    const fetchPro = fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer my-token',
        'My-Custom-Header': 'foobar',
      },
    });
    const res = await Promise.race([fetchPro, timeout(TIME_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// export const sendJson = async function (url, UpdlaodData) {
//   try {
//     const fetchPro = ;
//     const res = await Promise.race([fetchPro, timeout(TIME_SEC)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
