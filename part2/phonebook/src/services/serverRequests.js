import axios from 'axios'


const url = 'http://localhost:3001/persons'

const getAll = () => 
  axios
    .get(url)
    .then(response => response.data)

const create = (obj) => 
  axios
    .post(url, obj)
    .then(response => response.data)

const updateByID = (id, obj) =>
  axios
    .put(`${url}/${id}`, obj)
    .then(response => response.data)

const deleteByID = (id) =>
  axios
    .delete(`${url}/${id}`)
    .then(response => response.data)


export default { getAll, create, updateByID, deleteByID } 